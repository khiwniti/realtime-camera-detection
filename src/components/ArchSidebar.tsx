"use client";

import type { LucideIcon } from "lucide-react";
import { X, ChevronRight, Layers, Cpu, Globe, Zap, Shield, RefreshCw, Terminal, Sparkles } from "lucide-react";

interface ArchSidebarProps {
  open: boolean;
  onClose: () => void;
}

interface ArchNode {
  icon: LucideIcon;
  title: string;
  badge: string;
  color: string;
  description: string;
  details: string[];
}

const ARCH_NODES: ArchNode[] = [
  {
    icon: Globe,
    title: "Client-Side Execution",
    badge: "0 SERVER COST",
    color: "#38bdf8", // sky
    description: "Inference executes locally in the visitor's browser thread via WebGL & WASM — zero server infrastructure, zero video telemetry leaves client.",
    details: [
      "Hardware-accelerated WebGL 2.0 shader kernel",
      "SIMD-optimized WASM fallback for legacy chipsets",
      "MediaDevices HTML5 standard webcam pipeline",
      "HTMLVideoElement direct texture binding",
    ],
  },
  {
    icon: Cpu,
    title: "Neural Engine: COCO-SSD v2",
    badge: "LITE MOBILENET",
    color: "#a855f7", // purple
    description: "Lightweight single-shot multibox detector tuned for real-time edge performance without discrete GPU acceleration.",
    details: [
      "MobileNetV2 inverted residual bottleneck feature pyramid",
      "Multi-scale anchor box classification (80 COCO categories)",
      "Zero-copy frame transfer from DOM video buffer",
      "Average ~18-35 FPS on standard Intel/M-series silicon",
    ],
  },
  {
    icon: Layers,
    title: "Multi-Source Ingestion & HLS",
    badge: "LIVE CCTV",
    color: "#f59e0b", // amber
    description: "Adaptive stream consumer switching seamlessly between local webcams, direct MP4 clips, and municipal live CCTV HLS broadcasts.",
    details: [
      "hls.js adaptive bitrate demuxing for municipal .m3u8 streams",
      "Live streams tested against Udon City Axis IP traffic cameras",
      "Zero-latency WebRTC/getUserMedia webcam interface",
      "CORS-safe direct crossOrigin canvas readback",
    ],
  },
  {
    icon: RefreshCw,
    title: "Asynchronous Detection Loop",
    badge: "BACKPRESSURE GUARD",
    color: "#10b981", // emerald
    description: "Microtask-coordinated tick rate keeping inference synchronous to display refresh while shedding unprocessable dropped frames.",
    details: [
      "requestAnimationFrame loop synchronized to screen v-sync",
      "Dynamic throttling preventing mobile thermal saturation",
      "Confidence gating: discard low-probability ghost targets (<0.50)",
      "Per-second sliding window FPS & latency profiling",
    ],
  },
  {
    icon: Zap,
    title: "HUD Tactical Renderer",
    badge: "60 FPS CANVAS",
    color: "#ef4444", // rose
    description: "Military-spec heads-up display rendering cybernetic target locks, tactical corner brackets, and bounding boxes.",
    details: [
      "Low-overhead 2D Canvas context rendering layer",
      "Dynamic DPI scaling matching physical display bounds",
      "Target tracking crosshairs & glow shadow effects",
      "Non-blocking layout: canvas overlay independent of DOM",
    ],
  },
  {
    icon: Shield,
    title: "Edge Delivery on Vercel",
    badge: "EDGE GLOBAL",
    color: "#06b6d4", // cyan
    description: "Deployable worldwide in seconds — static compilation means near-instant TTFB and limitless concurrent users.",
    details: [
      "Next.js 15 App Router static generation (Static Export)",
      "Zero backend serverless spin-up time",
      "Zero data storage or session cookies — 100% private",
      "Automated Git-triggered Vercel CI/CD pipeline",
    ],
  },
];

export function ArchSidebar({ open, onClose }: ArchSidebarProps) {
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        role="dialog"
        aria-label="System Architecture"
        aria-modal="true"
        className={[
          "fixed top-0 right-0 h-full w-full max-w-lg bg-slate-950/95 z-50",
          "border-l border-cyan-500/20 flex flex-col shadow-2xl shadow-cyan-950/50",
          "transition-transform duration-300 ease-out backdrop-blur-2xl",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {/* Header */}
        <div className="sticky top-0 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <Terminal size={16} className="text-cyan-400" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-bold text-white tracking-wider uppercase flex items-center gap-2">
                SYSTEM ARCHITECTURE
                <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
              </h2>
              <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                Client-Native · 0 GPU Cloud Cost · Vercel Edge
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800 transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Callout Banner */}
        <div className="mx-6 mt-4 p-3.5 rounded-xl bg-gradient-to-r from-blue-950/60 to-cyan-950/60 border border-cyan-500/30 text-xs">
          <div className="flex items-center gap-2 text-cyan-300 font-mono font-bold mb-1">
            <Sparkles size={13} />
            <span>DESIGN PHILOSOPHY</span>
          </div>
          <p className="text-slate-300 leading-relaxed font-sans text-[11px]">
            Traditional computer vision relies on costly cloud GPU instances ($500+/mo). This architecture shifts 100% of compute into the client&apos;s WebGL hardware thread, making deployment free and infinite-scale.
          </p>
        </div>

        {/* Nodes list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3.5">
          {ARCH_NODES.map((node, idx) => {
            const Icon = node.icon;
            return (
              <div
                key={node.title}
                className="group relative rounded-xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/80 p-4 transition-all duration-200 hover:border-cyan-500/40"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex items-center justify-center w-7 h-7 rounded-lg"
                      style={{
                        backgroundColor: `${node.color}15`,
                        border: `1px solid ${node.color}40`,
                      }}
                    >
                      <Icon size={14} color={node.color} />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-500">
                        PHASE 0{idx + 1}
                      </div>
                      <h3 className="font-mono font-bold text-xs text-white">
                        {node.title}
                      </h3>
                    </div>
                  </div>

                  <span
                    className="text-[9px] font-mono font-bold px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: `${node.color}15`,
                      color: node.color,
                      border: `1px solid ${node.color}40`,
                    }}
                  >
                    {node.badge}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 mb-2.5 leading-relaxed font-sans">
                  {node.description}
                </p>

                {/* Sub-bullets */}
                <ul className="flex flex-col gap-1 pl-1">
                  {node.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-2 text-[10px] font-mono text-slate-400">
                      <ChevronRight size={11} className="mt-0.5 shrink-0" color={node.color} />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Tech Stack Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800/80">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">
            STACK DIRECTORY
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              "Next.js 15",
              "React 19",
              "TypeScript 5",
              "TensorFlow.js 4",
              "COCO-SSD v2",
              "hls.js",
              "Tailwind CSS",
              "Vercel Edge",
            ].map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-300"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
