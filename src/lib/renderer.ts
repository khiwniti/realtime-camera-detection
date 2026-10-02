import type { Detection, DetectionStats } from "@/types";
import { classColor, MIN_CONFIDENCE } from "./constants";

/**
 * Draws HUD-grade bounding boxes, corner brackets, target crosshairs,
 * and holographic label tags onto the overlay canvas.
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

    ctx.save();

    // 1. Semi-transparent fill within bounding box
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.08;
    ctx.fillRect(sx, sy, sw, sh);

    // 2. Outer glow on border
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.globalAlpha = 0.85;

    // 3. Subtle dashed bounding border
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(sx, sy, sw, sh);
    ctx.setLineDash([]); // reset

    // 4. Sharp corner brackets (military HUD target lock style)
    const bracketLen = Math.max(10, Math.min(sw * 0.25, sh * 0.25, 24));
    ctx.lineWidth = 3;
    ctx.globalAlpha = 1;

    // Top-left bracket
    ctx.beginPath();
    ctx.moveTo(sx, sy + bracketLen);
    ctx.lineTo(sx, sy);
    ctx.lineTo(sx + bracketLen, sy);
    ctx.stroke();

    // Top-right bracket
    ctx.beginPath();
    ctx.moveTo(sx + sw - bracketLen, sy);
    ctx.lineTo(sx + sw, sy);
    ctx.lineTo(sx + sw, sy + bracketLen);
    ctx.stroke();

    // Bottom-right bracket
    ctx.beginPath();
    ctx.moveTo(sx + sw, sy + sh - bracketLen);
    ctx.lineTo(sx + sw, sy + sh);
    ctx.lineTo(sx + sw - bracketLen, sy + sh);
    ctx.stroke();

    // Bottom-left bracket
    ctx.beginPath();
    ctx.moveTo(sx + bracketLen, sy + sh);
    ctx.lineTo(sx, sy + sh);
    ctx.lineTo(sx, sy + sh - bracketLen);
    ctx.stroke();

    // 5. Center crosshair for tight target tracking
    const cx = sx + sw / 2;
    const cy = sy + sh / 2;
    const chSize = 4;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.moveTo(cx - chSize, cy);
    ctx.lineTo(cx + chSize, cy);
    ctx.moveTo(cx, cy - chSize);
    ctx.lineTo(cx, cy + chSize);
    ctx.stroke();

    // 6. Holographic label chip
    const percent = Math.round(det.score * 100);
    const label = `${det.class.toUpperCase()} [${percent}%]`;
    ctx.font = "bold 11px 'JetBrains Mono', monospace";
    const textMetrics = ctx.measureText(label);
    const textH = 18;
    const textW = textMetrics.width + 12;
    const labelY = sy > textH + 4 ? sy - textH - 3 : sy + 4;
    const labelX = sx;

    // Chip shadow + background
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#030712f0";
    ctx.globalAlpha = 0.95;
    ctx.fillRect(labelX, labelY, textW, textH);

    // Left indicator bar in chip
    ctx.fillStyle = color;
    ctx.globalAlpha = 1;
    ctx.fillRect(labelX, labelY, 3, textH);

    // Label text
    ctx.fillStyle = "#ffffff";
    ctx.fillText(label, labelX + 8, labelY + 13);

    ctx.restore();
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
