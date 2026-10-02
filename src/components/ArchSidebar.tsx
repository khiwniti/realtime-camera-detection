"use client";

import type { LucideIcon } from "lucide-react";
import { X, ChevronRight, Layers, Cpu, Globe, Zap, Shield, RefreshCw } from "lucide-react";

interface ArchSidebarProps {
  open: boolean;
  onClose: () => void;
}

interface ArchNode {
  icon: LucideIcon;
  title: string;
  color: string;
  description: string;
  details: string[];
}

const ARCH_NODES: ArchNode[] = [
  {
    icon: Globe,
    title: "Browser Runtime",
    color: "#3b82f6",
    description: "All inference executes inside the visitor's browser tab — zero backend.",
    details: [
      "WebGL 2.0 GPU backend (TensorFlow.js)",
      "WASM fallback for devices without WebGL",
      "MediaDevices API for webcam streams",
      "HTMLVideoElement as model input tensor",
    ],
  },
  {
    icon: Cpu,
    title: "COCO-SSD Model",
    color: "#8b5cf6",
    description: "lite_mobilenet_v2 variant — ~2 MB weights, 80 object classes.",
    details: [
      "MobileNetV2 feature extractor (1.0 depth)",
      "SSD head: 6 feature map scales",
      "80 COCO categories (person, car, …)",
      "~15–30 FPS on typical laptop GPU",
      "~5–10 FPS on CPU-only path",
    ],
  },
  {
    icon: Layers,
    title: "Video Sources",
    color: "#f59e0b",
    description: "Pluggable source adapter: webcam stream or remote video URL.",
    details: [
      "getUserMedia() for live webcam",
      "MP4 / WebM via <video> src binding",
      "Custom URL input for any CORS-enabled stream",
      "Canvas overlay scaled to displayed video size",
    ],
  },
  {
    icon: RefreshCw,
    title: "Detection Loop",
    color: "#22c55e",
    description: "rAF-gated loop prevents backpressure when inference lags frames.",
    details: [
      "requestAnimationFrame + 100ms setTimeout",
      "Skips frames when video.readyState < 2",
      "Confidence threshold filter (≥ 0.5)",
      "FPS sampled every 1 000 ms",
    ],
  },
  {
    icon: Zap,
    title: "Canvas Renderer",
    color: "#ef4444",
    description: "2D canvas overlay: bounding boxes, corner accents, label chips.",
    details: [
      "Overlay canvas positioned absolute over video",
      "Scaled to display size, not intrinsic resolution",
      "Deterministic class → hue color mapping",
      "clearRect() every frame — no accumulation",
    ],
  },
  {
    icon: Shield,
    title: "Vercel Deployment",
    color: "#06b6d4",
    description: "Static Next.js export — no server-side logic, no GPU needed.",
    details: [
      "Next.js 15 App Router (client components)",
      "Edge CDN: all assets served from PoP",
      "Zero cold-start — no API routes",
      "No data leaves the browser (privacy by design)",
    ],
  },
];

/**
 * Slide-over sidebar explaining the full solution architecture.
 * Renders as a backdrop panel over the main view.
 */
export function ArchSidebar({ open, onClose }: ArchSidebarProps) {
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        role="dialog"
        aria-label="Solution Architecture"
        aria-modal="true"
        className={[
          "fixed top-0 right-0 h-full w-full max-w-md bg-slate-900 z-40",
          "border-l border-slate-700 flex flex-col",
          "transition-transform duration-300 ease-in-out",
          "overflow-y-auto",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-semibold text-white">Solution Architecture</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Client-only · No GPU · Vercel-native
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close architecture panel"
          >
            <X size={20} />
          </button>
        </div>

        {/* Intro */}
        <div className="px-6 py-4 bg-blue-950/40 border-b border-blue-900/40">
          <p className="text-sm text-slate-300 leading-relaxed">
            Real-time object detection that runs{" "}
            <strong className="text-blue-400">entirely in the browser</strong> — no server, no GPU
            cluster, no API keys. TensorFlow.js executes the COCO-SSD model against{" "}
            <strong className="text-blue-400">WebGL shaders</strong> on the visitor&apos;s device.
          </p>
        </div>

        {/* Architecture nodes */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {ARCH_NODES.map((node, idx) => {
            const Icon = node.icon;
            return (
              <div
                key={node.title}
                className="rounded-xl border border-slate-800 bg-slate-800/50 p-4"
              >
                {/* Node header */}
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg"
                    style={{ backgroundColor: `${node.color}22`, border: `1px solid ${node.color}44` }}
                  >
                    <Icon size={16} color={node.color} />
                  </div>
                  <div className="flex items-center gap-2">
                    {idx < ARCH_NODES.length - 1 && (
                      <span className="text-xs font-mono text-slate-600 w-5 text-right">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    )}
                    <h3 className="font-semibold text-white text-sm">{node.title}</h3>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-3 leading-relaxed">{node.description}</p>

                {/* Detail bullets */}
                <ul className="flex flex-col gap-1">
                  {node.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-2 text-xs text-slate-500">
                      <ChevronRight
                        size={12}
                        className="mt-0.5 shrink-0"
                        color={node.color}
                      />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Tech stack footer */}
        <div className="mt-auto px-6 py-5 border-t border-slate-800">
          <p className="text-xs text-slate-500 font-medium mb-3 uppercase tracking-wider">
            Stack
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "Next.js 15",
              "React 19",
              "TypeScript",
              "TensorFlow.js 4",
              "COCO-SSD",
              "Tailwind CSS",
              "Vercel",
              "WebGL",
            ].map((tech) => (
              <span
                key={tech}
                className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
