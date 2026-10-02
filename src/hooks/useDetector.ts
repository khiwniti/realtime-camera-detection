"use client";

import { useRef, useState, useCallback, useEffect } from "react";
// Exception: TF.js core (~2 MB WASM) and COCO-SSD weights (~2 MB) are deferred
// via dynamic import to keep initial JS bundle paint-blocking free. The module
// paths are literals, but load must happen after user gesture — static import
// would block hydration for all visitors, even those who never start detection.
import Hls from "hls.js";
import type { ObjectDetection } from "@tensorflow-models/coco-ssd";
import type { Detection, DetectionStats, ModelStatus, VideoSource } from "@/types";
import { drawDetections, computeStats } from "@/lib/renderer";
import { DETECTION_INTERVAL_MS, MIN_CONFIDENCE } from "@/lib/constants";

/**
 * Core hook: loads COCO-SSD model, manages video source binding,
 * handles both native MP4/WebM and HLS (.m3u8) live CCTV feeds,
 * runs the detection loop, and renders overlays.
 *
 * Design decisions:
 * - TensorFlow.js + COCO-SSD loaded dynamically (code-split) to avoid
 *   blocking initial paint (~4 MB WASM + model weights).
 * - hls.js dynamically loaded only when an .m3u8 stream is active.
 * - requestAnimationFrame-gated loop prevents backpressure when inference
 *   is slower than frame rate.
 * - All inference runs on the browser's WebGL/WASM backend — zero server cost.
 */
export function useDetector() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelRef = useRef<ObjectDetection | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const rafRef = useRef<number>(0);
  const activeRef = useRef(false);
  const streamRef = useRef<MediaStream | null>(null);

  const [modelStatus, setModelStatus] = useState<ModelStatus>("idle");
  const [stats, setStats] = useState<DetectionStats>({
    fps: 0,
    totalObjects: 0,
    classCounts: {},
    inferenceMs: 0,
  });
  const [activeSource, setActiveSource] = useState<VideoSource | null>(null);
  const [error, setError] = useState<string | null>(null);

  // FPS tracking — refs avoid re-render churn on every frame
  const fpsFrames = useRef(0);
  const fpsLastTime = useRef(performance.now());
  const fpsValue = useRef(0);

  /**
   * Dynamically load TF.js + COCO-SSD on demand.
   * Exception: deferred to avoid blocking initial paint with ~4 MB of model
   * weights. The specifiers are literals; the defer is intentional UX policy.
   */
  const loadModel = useCallback(async () => {
    if (modelRef.current) return;
    setModelStatus("loading");
    setError(null);
    try {
      const tf = await import("@tensorflow/tfjs"); // deferred — see top comment
      await tf.ready(); // Prefer WebGL, fall back to WASM, then CPU
      const cocoSsd = await import("@tensorflow-models/coco-ssd"); // deferred — see top comment
      const model = await cocoSsd.load({ base: "lite_mobilenet_v2" });
      modelRef.current = model;
      setModelStatus("ready");
    } catch (err) {
      console.error("Model load failed:", err);
      setModelStatus("error");
      setError(err instanceof Error ? err.message : "Failed to load detection model");
    }
  }, []);

  /** Stop any active media stream. */
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }
  }, []);

  /** Destroy active HLS instance. */
  const destroyHls = useCallback(() => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  }, []);

  /** Stop the detection loop and clear all state. */
  const stopDetection = useCallback(() => {
    activeRef.current = false;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    stopStream();
    destroyHls();
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.src = "";
      videoRef.current.removeAttribute("src");
      videoRef.current.load();
    }
    setActiveSource(null);
    setStats({ fps: 0, totalObjects: 0, classCounts: {}, inferenceMs: 0 });
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, [stopStream, destroyHls]);

  /** Run one detection frame, then schedule the next via rAF + timeout. */
  const detectFrame = useCallback(async () => {
    if (!activeRef.current || !modelRef.current || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    if (video.readyState < 2) {
      // Video not ready yet — retry next frame without burning CPU
      rafRef.current = requestAnimationFrame(() => {
        setTimeout(detectFrame, DETECTION_INTERVAL_MS);
      });
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Scale canvas overlay to match the video's *displayed* size
    const displayW = canvas.clientWidth;
    const displayH = canvas.clientHeight;
    if (canvas.width !== displayW || canvas.height !== displayH) {
      canvas.width = displayW;
      canvas.height = displayH;
    }

    const scaleX = displayW / (video.videoWidth || displayW);
    const scaleY = displayH / (video.videoHeight || displayH);

    const t0 = performance.now();
    try {
      const predictions = await modelRef.current.detect(video);
      const inferenceMs = performance.now() - t0;

      const detections: Detection[] = predictions
        .filter((p) => p.score >= MIN_CONFIDENCE)
        .map((p) => ({
          class: p.class,
          score: p.score,
          bbox: p.bbox as [number, number, number, number],
        }));

      drawDetections(ctx, detections, scaleX, scaleY);

      // FPS: count frames per second, update once per second
      fpsFrames.current++;
      const now = performance.now();
      if (now - fpsLastTime.current >= 1000) {
        fpsValue.current = fpsFrames.current;
        fpsFrames.current = 0;
        fpsLastTime.current = now;
      }

      setStats(computeStats(detections, inferenceMs, fpsValue.current));
    } catch {
      // Inference error (e.g. video context lost, tab hidden) — skip frame silently
    }

    if (activeRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        setTimeout(detectFrame, DETECTION_INTERVAL_MS);
      });
    }
  }, []);

  /** Bind a video source and start the detection loop. */
  const startSource = useCallback(
    async (source: VideoSource) => {
      stopDetection();
      setError(null);

      if (!modelRef.current) {
        await loadModel();
        if (!modelRef.current) return; // load failed — error set inside loadModel
      }

      const video = videoRef.current;
      if (!video) return;

      try {
        if (source.type === "webcam") {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } },
            audio: false,
          });
          streamRef.current = stream;
          video.srcObject = stream;
          await video.play();
        } else if (source.url) {
          const isHls = source.url.includes(".m3u8");

          if (isHls) {
            if (Hls.isSupported()) {
              const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 30,
              });
              hlsRef.current = hls;

              await new Promise<void>((resolve, reject) => {
                hls.loadSource(source.url!);
                hls.attachMedia(video);

                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                  video
                    .play()
                    .then(() => resolve())
                    .catch(reject);
                });

                hls.on(Hls.Events.ERROR, (_event, data) => {
                  if (data.fatal) {
                    reject(new Error(`HLS error: ${data.details || data.type}`));
                  }
                });
              });
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
              // Safari native HLS
              video.src = source.url;
              await video.play();
            } else {
              throw new Error("HLS is not supported in this browser");
            }
          } else {
            // Standard MP4/WebM video
            video.src = source.url;
            video.crossOrigin = "anonymous";
            video.loop = true;
            video.muted = true;
            await video.play();
          }
        }

        activeRef.current = true;
        setActiveSource(source);
        fpsFrames.current = 0;
        fpsLastTime.current = performance.now();
        fpsValue.current = 0;
        detectFrame();
      } catch (err) {
        console.error("Source start failed:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to start video source. Check camera permissions or stream availability.",
        );
        stopDetection();
      }
    },
    [stopDetection, loadModel, detectFrame],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      activeRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      stopStream();
      destroyHls();
    };
  }, [stopStream, destroyHls]);

  return {
    videoRef,
    canvasRef,
    modelStatus,
    stats,
    activeSource,
    error,
    loadModel,
    startSource,
    stopDetection,
  };
}
