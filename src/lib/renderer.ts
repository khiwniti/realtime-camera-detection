import type { Detection, DetectionStats } from "@/types";
import { classColor, MIN_CONFIDENCE } from "./constants";

/**
 * Draws bounding boxes + labels onto a 2D canvas overlay.
 * The canvas MUST be sized to match the video source dimensions.
 */
export function drawDetections(
  ctx: CanvasRenderingContext2D,
  detections: Detection[],
  scaleX: number,
  scaleY: number,
): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  for (const det of detections) {
    if (det.score < MIN_CONFIDENCE) continue;

    const [x, y, w, h] = det.bbox;
    const sx = x * scaleX;
    const sy = y * scaleY;
    const sw = w * scaleX;
    const sh = h * scaleY;
    const color = classColor(det.class);

    // Bounding box
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(sx, sy, sw, sh);

    // Corner accents (top-left and bottom-right)
    const cornerLen = Math.min(sw, sh, 20);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(sx, sy + cornerLen);
    ctx.lineTo(sx, sy);
    ctx.lineTo(sx + cornerLen, sy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(sx + sw - cornerLen, sy + sh);
    ctx.lineTo(sx + sw, sy + sh);
    ctx.lineTo(sx + sw, sy + sh - cornerLen);
    ctx.stroke();

    // Label background
    const label = `${det.class} ${(det.score * 100).toFixed(0)}%`;
    ctx.font = "bold 13px Inter, system-ui, sans-serif";
    const textMetrics = ctx.measureText(label);
    const textH = 20;
    const textW = textMetrics.width + 10;
    const labelY = sy > textH ? sy - textH : sy;

    ctx.fillStyle = color;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(sx, labelY, textW, textH);
    ctx.globalAlpha = 1;

    // Label text
    ctx.fillStyle = "#ffffff";
    ctx.fillText(label, sx + 5, labelY + 14);
  }
}

/**
 * Computes aggregated statistics from a detection frame.
 */
export function computeStats(
  detections: Detection[],
  inferenceMs: number,
  fps: number,
): DetectionStats {
  const filtered = detections.filter((d) => d.score >= MIN_CONFIDENCE);
  const classCounts: Record<string, number> = {};
  for (const d of filtered) {
    classCounts[d.class] = (classCounts[d.class] || 0) + 1;
  }
  return {
    fps: Math.round(fps),
    totalObjects: filtered.length,
    classCounts,
    inferenceMs: Math.round(inferenceMs),
  };
}
