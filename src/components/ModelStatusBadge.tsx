"use client";

import type { ModelStatus } from "@/types";
import { Loader2, CheckCircle2, AlertOctagon, Radio } from "lucide-react";

interface ModelStatusBadgeProps {
  status: ModelStatus;
}

const STATUS_CONFIG: Record<
  ModelStatus,
  { label: string; dotClass: string; textColor: string; Icon: React.ComponentType<{ size?: number; className?: string }> }
> = {
  idle: {
    label: "ENGINE READY",
    dotClass: "bg-slate-400",
    textColor: "text-slate-400",
    Icon: Radio,
  },
  loading: {
    label: "WARMING ENGINE...",
    dotClass: "bg-cyan-400",
    textColor: "text-cyan-400",
    Icon: Loader2,
  },
  ready: {
    label: "INFERENCE ACTIVE",
    dotClass: "bg-emerald-400",
    textColor: "text-emerald-400",
    Icon: CheckCircle2,
  },
  error: {
    label: "ENGINE FAULT",
    dotClass: "bg-rose-400",
    textColor: "text-rose-400",
    Icon: AlertOctagon,
  },
};

export function ModelStatusBadge({ status }: ModelStatusBadgeProps) {
  const { label, dotClass, textColor, Icon } = STATUS_CONFIG[status];

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
      <span className="relative flex h-2 w-2">
        {status === "ready" && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotClass} opacity-75`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotClass}`} />
      </span>

      <span className={`text-[10px] font-mono font-bold tracking-wider ${textColor}`}>
        {label}
      </span>

      {status === "loading" && (
        <Loader2 size={12} className="animate-spin text-cyan-400" />
      )}
    </div>
  );
}
