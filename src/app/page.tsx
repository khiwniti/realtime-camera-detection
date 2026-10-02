"use client";

import { useState } from "react";
import { useDetector } from "@/hooks/useDetector";
import { HudOverlay } from "@/components/HudOverlay";
import { SourceSelector } from "@/components/SourceSelector";
import { ModelStatusBadge } from "@/components/ModelStatusBadge";
import { ArchSidebar } from "@/components/ArchSidebar";
import {
  Layers,
  Square,
  AlertTriangle,
  Scan,
  ShieldCheck,
  Video,
  ExternalLink,
  Github,
} from "lucide-react";

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
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Decorative Cyber Grid */}
      <div className="fixed inset-0 pointer-events-none bg-cyber-grid opacity-60 z-0" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-cyan-500/10 via-blue-500/5 to-transparent blur-3xl pointer-events-none z-0" />

      {/* ── Top Command Bar ── */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25 border border-cyan-400/40">
            <Scan size={18} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-mono font-bold text-white tracking-wider uppercase">
                AETHERIA VISION
              </h1>
              <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                EDGE AI
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              Zero-Cloud Computer Vision Engine · Udon City CCTV
            </p>
          </div>
        </div>

        {/* Status + Architecture Trigger */}
        <div className="flex items-center gap-3">
          <ModelStatusBadge status={modelStatus} />

          <button
            onClick={() => setArchOpen(true)}
            className={[
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium",
              "bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700/80 text-slate-200",
              "hover:border-cyan-500/50 hover:text-white transition-all shadow-sm",
              "focus:outline-none focus:ring-2 focus:ring-cyan-500/40",
            ].join(" ")}
          >
            <Layers size={14} className="text-cyan-400" />
            <span className="hidden sm:inline">ARCHITECTURE</span>
          </button>

          <a
            href="https://github.com/khiwniti/realtime-camera-detection"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800 transition-colors"
            title="View Source on GitHub"
          >
            <Github size={16} />
          </a>
        </div>
      </header>

      {/* ── Feed Selector Bar ── */}
      <section className="relative z-10 px-4 sm:px-6 py-3.5 border-b border-slate-800/60 bg-slate-950/40 backdrop-blur-md">
        <SourceSelector
          activeSource={activeSource}
          onSelect={startSource}
          onStop={stopDetection}
        />
      </section>

      {/* ── Viewport Area ── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl flex flex-col gap-3">
          {/* Main Video Screen */}
          <div
            className={[
              "relative w-full rounded-2xl overflow-hidden",
              "bg-slate-950/90 border border-slate-800 shadow-2xl shadow-black",
              "transition-all duration-300",
              activeSource ? "border-cyan-500/40 shadow-cyan-950/30" : "",
            ].join(" ")}
            style={{ aspectRatio: "16/9" }}
          >
            {/* Idle Placeholder */}
            {!activeSource && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-slate-500 p-6">
                <div className="relative flex items-center justify-center w-24 h-24 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-inner">
                  <Video size={36} className="text-slate-600 animate-pulse-slow" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-500/40 border border-cyan-400 animate-ping" />
                </div>
                <div className="text-center max-w-md">
                  <h3 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider mb-1">
                    TARGET ACQUISITION IDLE
                  </h3>
                  <p className="text-xs text-slate-500 font-sans leading-relaxed">
                    Select a municipal CCTV stream above or activate your local webcam to engage real-time COCO-SSD object recognition.
                  </p>
                </div>
              </div>
            )}

            {/* Error Overlay */}
            {error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 bg-slate-950/90 backdrop-blur-md z-30">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <AlertTriangle size={24} />
                </div>
                <div className="text-center max-w-sm">
                  <div className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                    FEED CONNECTION ERROR
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-sans">{error}</p>
                </div>
                <button
                  onClick={stopDetection}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  DISMISS
                </button>
              </div>
            )}

            {/* Live video layer */}
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
              style={{ display: activeSource ? "block" : "none" }}
            />

            {/* Canvas detection overlay */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ display: activeSource ? "block" : "none" }}
            />

            {/* Tactical HUD */}
            <HudOverlay stats={stats} isActive={!!activeSource} />

            {/* Stop / Disengage Button */}
            {activeSource && (
              <button
                onClick={stopDetection}
                className={[
                  "absolute bottom-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-bold",
                  "bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-200",
                  "backdrop-blur-md transition-all shadow-lg shadow-rose-950/50",
                  "focus:outline-none focus:ring-2 focus:ring-rose-500/50",
                ].join(" ")}
              >
                <Square size={12} className="fill-rose-400" />
                <span>DISENGAGE</span>
              </button>
            )}

            {/* Subtle Viewport Corner Marks */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-slate-700 pointer-events-none" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-slate-700 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-slate-700 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-slate-700 pointer-events-none" />
          </div>

          {/* Under-player Telemetry Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-2 text-[11px] font-mono text-slate-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-slate-400">
                <ShieldCheck size={13} className="text-emerald-400" />
                <span>100% LOCAL INFERENCE · ZERO PRIVACY LEAK</span>
              </span>
              {activeSource && (
                <>
                  <span>·</span>
                  <span className="text-cyan-400 truncate max-w-xs">
                    {activeSource.label}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-4">
              <span>BACKEND: WEBGL 2.0</span>
              <span>QUANT: FP32</span>
            </div>
          </div>
        </div>
      </main>

      {/* ── Slide-over Architecture Panel ── */}
      <ArchSidebar open={archOpen} onClose={() => setArchOpen(false)} />
    </div>
  );
}
