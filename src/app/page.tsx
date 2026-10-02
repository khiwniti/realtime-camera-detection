"use client";

import { useState } from "react";
import { useDetector } from "@/hooks/useDetector";
import { HudOverlay } from "@/components/HudOverlay";
import { SourceSelector } from "@/components/SourceSelector";
import { ModelStatusBadge } from "@/components/ModelStatusBadge";
import { ArchSidebar } from "@/components/ArchSidebar";
import { BookOpen, Square, AlertTriangle } from "lucide-react";

/**
 * Single-page application root.
 *
 * Layout:
 *   ┌───────────────────────────────────┐
 *   │ Header (title, arch button)       │
 *   ├───────────────────────────────────┤
 *   │ Source selector bar               │
 *   ├───────────────────────────────────┤
 *   │ Video viewport + canvas overlay   │
 *   │   └─ HUD (fps, count, classes)   │
 *   ├───────────────────────────────────┤
 *   │ Status / error strip              │
 *   └───────────────────────────────────┘
 *   ArchSidebar: slide-over from right
 */
export default function HomePage() {
  const {
    videoRef,
    canvasRef,
    modelStatus,
    stats,
    activeSource,
    error,
    startSource,
    stopDetection,
  } = useDetector();

  const [archOpen, setArchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* ── Header ── */}
      <header className="border-b border-slate-800 px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-white leading-tight">
            Realtime Object Detection
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Browser-native · COCO-SSD · No GPU required
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ModelStatusBadge status={modelStatus} />
          <button
            onClick={() => setArchOpen(true)}
            className={[
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
              "bg-slate-800 border border-slate-700 text-slate-300",
              "hover:bg-slate-700 hover:border-slate-600 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950",
            ].join(" ")}
          >
            <BookOpen size={15} />
            Architecture
          </button>
        </div>
      </header>

      {/* ── Source selector ── */}
      <section className="px-4 sm:px-6 py-4 border-b border-slate-800/60">
        <SourceSelector
          activeSource={activeSource}
          onSelect={startSource}
          onStop={stopDetection}
        />
      </section>

      {/* ── Video viewport ── */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
        <div
          className={[
            "relative w-full max-w-4xl rounded-2xl overflow-hidden",
            "bg-slate-900 border border-slate-800",
            "shadow-2xl shadow-black/60",
          ].join(" ")}
          style={{ aspectRatio: "16/9" }}
        >
          {/* Idle placeholder */}
          {!activeSource && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-slate-600">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="w-10 h-10 text-slate-700"
                >
                  <path d="M15 10l4.55-2.27A1 1 0 0121 8.73v6.54a1 1 0 01-1.45.9L15 14M4 8h9a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2z" />
                </svg>
              </div>
              <p className="text-sm">Select a source above to start detection</p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
              <AlertTriangle size={36} className="text-red-400" />
              <p className="text-sm text-red-300 text-center max-w-xs">{error}</p>
              <button
                onClick={stopDetection}
                className="text-xs text-slate-400 underline underline-offset-2 hover:text-slate-200"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Live video element (always mounted — hooks bind to it) */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
            style={{ display: activeSource ? "block" : "none" }}
          />

          {/* Canvas overlay for bounding boxes */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ display: activeSource ? "block" : "none" }}
          />

          {/* HUD */}
          <HudOverlay stats={stats} isActive={!!activeSource} />

          {/* Stop button — only when active */}
          {activeSource && (
            <button
              onClick={stopDetection}
              className={[
                "absolute bottom-3 right-3 z-20",
                "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium",
                "bg-slate-900/80 backdrop-blur border border-slate-700 text-slate-300",
                "hover:bg-red-900/60 hover:border-red-700 hover:text-red-200 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-red-500",
              ].join(" ")}
            >
              <Square size={12} />
              Stop
            </button>
          )}
        </div>

        {/* Active source label */}
        {activeSource && (
          <p className="mt-3 text-xs text-slate-500">
            <span className="text-slate-400 font-medium">{activeSource.label}</span>
            {activeSource.type === "url" && (
              <>
                {" · "}
                <span className="font-mono text-slate-600 truncate max-w-xs inline-block align-bottom">
                  {activeSource.url}
                </span>
              </>
            )}
          </p>
        )}
      </main>

      {/* ── Architecture sidebar ── */}
      <ArchSidebar open={archOpen} onClose={() => setArchOpen(false)} />
    </div>
  );
}
