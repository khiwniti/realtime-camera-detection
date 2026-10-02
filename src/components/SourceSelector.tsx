"use client";

import type { VideoSource } from "@/types";
import { VIDEO_SOURCES } from "@/lib/constants";
import {
  Camera,
  Car,
  PersonStanding,
  Building2,
  Radio,
  Plus,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";

interface SourceSelectorProps {
  activeSource: VideoSource | null;
  onSelect: (source: VideoSource) => void;
  onStop: () => void;
}

const ICON_MAP: Record<VideoSource["icon"], React.ComponentType<{ size?: number; className?: string }>> = {
  camera: Camera,
  traffic: Car,
  pedestrian: PersonStanding,
  office: Building2,
  city: Radio,
  custom: Plus,
};

export function SourceSelector({ activeSource, onSelect, onStop }: SourceSelectorProps) {
  const [customUrl, setCustomUrl] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  function handleCustomSubmit() {
    const url = customUrl.trim();
    if (!url) return;
    const source: VideoSource = {
      id: "custom",
      label: "Custom Stream",
      description: url,
      type: "url",
      url,
      icon: "custom",
    };
    onSelect(source);
    setShowCustom(false);
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Source buttons pills */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="text-[11px] font-mono font-medium text-slate-500 uppercase tracking-widest mr-1 hidden sm:block">
          SOURCE FEED:
        </div>

        {VIDEO_SOURCES.map((source) => {
          const Icon = ICON_MAP[source.icon];
          const isActive = activeSource?.id === source.id;
          const isUdon = source.id.startsWith("udon-");

          return (
            <button
              key={source.id}
              onClick={() => (isActive ? onStop() : onSelect(source))}
              className={[
                "group relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-mono font-medium",
                "transition-all duration-200 border",
                isActive
                  ? "bg-gradient-to-r from-blue-600/90 to-cyan-600/90 border-cyan-400/60 text-white shadow-lg shadow-cyan-500/20"
                  : "bg-slate-900/80 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700 text-slate-300",
              ].join(" ")}
              title={source.description}
            >
              {/* Active glow dot */}
              {isActive ? (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                </span>
              ) : (
                <Icon
                  size={14}
                  className="text-slate-400 group-hover:text-cyan-400 transition-colors"
                />
              )}

              <span>{source.label}</span>

              {/* Tag indicator for real municipal CCTV */}
              {isUdon && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300">
                  CCTV
                </span>
              )}

              {source.id === "webcam" && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                  LOCAL
                </span>
              )}
            </button>
          );
        })}

        {/* Custom URL Trigger */}
        <button
          onClick={() => setShowCustom((v) => !v)}
          className={[
            "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all border",
            showCustom
              ? "bg-slate-800 border-cyan-500/40 text-cyan-300"
              : "bg-slate-900/60 hover:bg-slate-800/60 border-slate-800/80 text-slate-400 hover:text-slate-200",
          ].join(" ")}
        >
          <Plus size={13} />
          <span>CUSTOM URL</span>
        </button>
      </div>

      {/* Expandable Custom URL input */}
      {showCustom && (
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-md animate-in fade-in duration-200">
          <input
            type="url"
            placeholder="Paste direct .m3u8 (HLS) or .mp4 URL (e.g. https://.../stream.m3u8)"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit()}
            className={[
              "flex-1 px-3 py-1.5 text-xs font-mono bg-slate-950/80 border border-slate-800 rounded-lg",
              "text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30",
            ].join(" ")}
          />
          <button
            onClick={handleCustomSubmit}
            disabled={!customUrl.trim()}
            className={[
              "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all",
              "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500",
              "disabled:opacity-30 disabled:cursor-not-allowed shadow-md shadow-cyan-900/20",
            ].join(" ")}
          >
            <span>LOAD</span>
            <ArrowRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
