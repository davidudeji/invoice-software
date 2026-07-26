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

const statusStyles: Record<BadgeStatus, string> = {
  draft:     "bg-slate-100 text-slate-600",
  sent:      "bg-sky-50 text-sky-700",
  paid:      "bg-[#EBF2FF] text-[#0B44C2]",
  overdue:   "bg-red-50 text-red-700",
  partial:   "bg-amber-50 text-amber-700",
  cancelled: "bg-slate-100 text-slate-400",
};

export function Badge({ status, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold tracking-tight",
        statusStyles[status],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function BadgeIndicator({ status }: { status: BadgeStatus }) {
  const colors = {
    draft:     "bg-slate-300",
    sent:      "bg-sky-400",
    paid:      "bg-[#1469F8]",
    overdue:   "bg-red-500",
    partial:   "bg-amber-500",
    cancelled: "bg-slate-300",
  };

  return (
    <span className={cn("inline-block w-2 h-2 rounded-full", colors[status])} />
  );
}
