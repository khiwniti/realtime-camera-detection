"use client";

import type { VideoSource } from "@/types";
import { VIDEO_SOURCES } from "@/lib/constants";
import {
  Camera,
  Car,
  PersonStanding,
  Building2,
  Globe,
  Plus,
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
  city: Globe,
  custom: Plus,
};

/**
 * Horizontal source selector bar.
 * Shows preset sources + a custom URL input.
 */
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
      {/* Preset source buttons */}
      <div className="flex flex-wrap gap-2">
        {VIDEO_SOURCES.map((source) => {
          const Icon = ICON_MAP[source.icon];
          const isActive = activeSource?.id === source.id;
          return (
            <button
              key={source.id}
              onClick={() => (isActive ? onStop() : onSelect(source))}
              className={[
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                "border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900",
                isActive
                  ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40"
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600",
              ].join(" ")}
              title={source.description}
            >
              <Icon size={16} className={isActive ? "text-blue-200" : "text-slate-400"} />
              {source.label}
              {isActive && (
                <span className="inline-flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              )}
            </button>
          );
        })}

        {/* Custom URL */}
        <button
          onClick={() => setShowCustom((v) => !v)}
          className={[
            "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
            "border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900",
            showCustom
              ? "bg-slate-700 border-slate-500 text-white"
              : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700",
          ].join(" ")}
        >
          <Plus size={16} />
          Custom URL
        </button>
      </div>

      {/* Custom URL input (shown on toggle) */}
      {showCustom && (
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://example.com/stream.mp4  — MP4 / WebM with CORS support"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit()}
            className={[
              "flex-1 px-3 py-2 rounded-lg text-sm bg-slate-900 border border-slate-700",
              "text-slate-200 placeholder-slate-600 font-mono",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            ].join(" ")}
          />
          <button
            onClick={handleCustomSubmit}
            disabled={!customUrl.trim()}
            className={[
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              "bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed",
              "focus:outline-none focus:ring-2 focus:ring-blue-500",
            ].join(" ")}
          >
            Load
          </button>
        </div>
      )}
    </div>
  );
}
