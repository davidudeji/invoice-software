"use client";

import React from "react";
import { cn } from "@/lib/utils";

type BadgeStatus =
  | "draft"
  | "sent"
  | "paid"
  | "overdue"
  | "partial"
  | "cancelled";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: BadgeStatus;
  children: React.ReactNode;
}

const statusStyles: Record<BadgeStatus, { bg: string; color: string; dot: string }> = {
  draft:     { bg: "rgba(71,85,105,0.18)",   color: "#94a3b8", dot: "#475569" },
  sent:      { bg: "rgba(14,165,233,0.15)",  color: "#38bdf8", dot: "#0ea5e9" },
  paid:      { bg: "rgba(59,130,246,0.15)",  color: "#60a5fa", dot: "#3b82f6" },
  overdue:   { bg: "rgba(239,68,68,0.15)",   color: "#fca5a5", dot: "#ef4444" },
  partial:   { bg: "rgba(245,158,11,0.15)",  color: "#fbbf24", dot: "#f59e0b" },
  cancelled: { bg: "rgba(71,85,105,0.12)",   color: "#475569", dot: "#334155" },
};

export function Badge({ status, className, children, ...props }: BadgeProps) {
  const { bg, color, dot } = statusStyles[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-tight",
        className,
      )}
      style={{ background: bg, color }}
      {...props}
    >
      <span
        className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: dot }}
      />
      {children}
    </span>
  );
}

export function BadgeIndicator({ status }: { status: BadgeStatus }) {
  const { dot } = statusStyles[status];
  return (
    <span
      className="inline-block w-2 h-2 rounded-full"
      style={{ background: dot }}
    />
  );
}
