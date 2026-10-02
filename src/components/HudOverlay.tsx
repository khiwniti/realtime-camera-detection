"use client";

import type { DetectionStats } from "@/types";
import { classColor } from "@/lib/constants";
import { Activity, Target, Zap } from "lucide-react";

interface HudOverlayProps {
  stats: DetectionStats;
  isActive: boolean;
}

/**
 * Transparent HUD strip rendered over the video showing live detection metrics.
 * Designed with a sci-fi command-center aesthetic, glassmorphism, and live indicators.
 */
export function HudOverlay({ stats, isActive }: HudOverlayProps) {
  if (!isActive) return null;

  const topClasses = Object.entries(stats.classCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-none z-20">
      {/* Left HUD: Live Telemetry */}
      <div className="flex flex-col gap-2">
        {/* Core telemetry pills */}
        <div className="flex items-center gap-2">
          {/* Live badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-950/80 border border-red-500/40 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-[11px] font-mono font-bold text-red-300 tracking-wider">LIVE FEED</span>
          </div>

          <MetricPill
            icon={Activity}
            label="FPS"
            value={stats.fps.toString()}
            color="#10b981"
            good={stats.fps >= 15}
          />

          <MetricPill
            icon={Target}
            label="TARGETS"
            value={stats.totalObjects.toString()}
            color="#38bdf8"
          />

          <MetricPill
            icon={Zap}
            label="LATENCY"
            value={`${stats.inferenceMs}ms`}
            color="#f59e0b"
          />
        </div>

        {/* Dynamic Class Tags */}
        {topClasses.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {topClasses.map(([cls, count]) => {
              const col = classColor(cls);
              return (
                <div
                  key={cls}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono backdrop-blur-md transition-all duration-150"
                  style={{
                    backgroundColor: `${col}18`,
                    border: `1px solid ${col}66`,
                    color: col,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: col }} />
                  <span className="font-semibold tracking-wide uppercase">{cls}</span>
                  <span className="px-1 py-0.2 rounded bg-black/40 text-[10px] font-bold">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right HUD: Compass / Targeting Grid coordinate display */}
      <div className="hidden sm:flex flex-col items-end gap-1 font-mono text-[10px] text-cyan-400/60 bg-slate-950/60 backdrop-blur-md px-2.5 py-1.5 rounded border border-cyan-500/20">
        <div>SYS: TF-WASM / WEBGL</div>
        <div>MODEL: COCO-SSD v2</div>
        <div className="text-cyan-300">CONF: ≥ 50%</div>
      </div>
    </div>
  );
}

function MetricPill({
  icon: Icon,
  label,
  value,
  color,
  good,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  color: string;
  good?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono backdrop-blur-md"
      style={{
        backgroundColor: "rgba(3, 7, 18, 0.75)",
        border: `1px solid ${color}44`,
        boxShadow: `0 0 12px -3px ${color}33`,
      }}
    >
      <Icon size={13} style={{ color }} />
      <span className="font-bold tracking-tight" style={{ color }}>
        {value}
      </span>
      <span className="text-[10px] font-medium text-slate-400 tracking-wider">
        {label}
      </span>
    </div>
  );
}
