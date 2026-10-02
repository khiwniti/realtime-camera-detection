"use client";

import type { ModelStatus } from "@/types";
import { Loader2, CheckCircle2, XCircle, Info } from "lucide-react";

interface ModelStatusBadgeProps {
  status: ModelStatus;
}

const STATUS_CONFIG: Record<
  ModelStatus,
  { label: string; color: string; Icon: React.ComponentType<{ size?: number; className?: string }> }
> = {
  idle: {
    label: "Select a source to begin",
    color: "text-slate-400",
    Icon: Info,
  },
  loading: {
    label: "Loading model…",
    color: "text-blue-400",
    Icon: Loader2,
  },
  ready: {
    label: "Model ready",
    color: "text-green-400",
    Icon: CheckCircle2,
  },
  error: {
    label: "Model failed to load",
    color: "text-red-400",
    Icon: XCircle,
  },
};

export function ModelStatusBadge({ status }: ModelStatusBadgeProps) {
  const { label, color, Icon } = STATUS_CONFIG[status];
  return (
    <div className={`flex items-center gap-1.5 text-xs font-medium ${color}`}>
      <Icon
        size={14}
        className={status === "loading" ? "animate-spin" : ""}
      />
      {label}
    </div>
  );
}
