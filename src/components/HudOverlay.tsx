"use client";

import type { DetectionStats } from "@/types";
import { classColor } from "@/lib/constants";

interface HudOverlayProps {
  stats: DetectionStats;
  isActive: boolean;
}

/**
 * Transparent HUD strip rendered over the video showing live detection metrics.
 * Positioned top-left; uses backdrop-blur so it stays readable over any scene.
 */
export function HudOverlay({ stats, isActive }: HudOverlayProps) {
  if (!isActive) return null;

  const topClasses = Object.entries(stats.classCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="absolute top-3 left-3 flex flex-col gap-2 z-20 pointer-events-none">
      {/* Core metrics */}
      <div className="flex gap-2">
        <MetricPill label="FPS" value={stats.fps.toString()} color="#22c55e" />
        <MetricPill label="Objects" value={stats.totalObjects.toString()} color="#3b82f6" />
        <MetricPill label="Infer" value={`${stats.inferenceMs}ms`} color="#f59e0b" />
      </div>

      {/* Class breakdown */}
      {topClasses.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {topClasses.map(([cls, count]) => (
            <span
              key={cls}
              className="text-xs font-mono px-2 py-0.5 rounded"
              style={{
                backgroundColor: `${classColor(cls)}22`,
                border: `1px solid ${classColor(cls)}88`,
                color: classColor(cls),
              }}
            >
              {cls} ×{count}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function MetricPill({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono"
      style={{
        backgroundColor: "#0f172acc",
        border: `1px solid ${color}55`,
        backdropFilter: "blur(8px)",
      }}
    >
      <span style={{ color }} className="font-bold">
        {value}
      </span>
      <span className="text-slate-400">{label}</span>
    </div>
  );
}
