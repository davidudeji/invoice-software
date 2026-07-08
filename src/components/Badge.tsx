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
  draft: "bg-slate-100 text-slate-700",
  sent: "bg-slate-100 text-slate-600",
  paid: "bg-emerald-50 text-emerald-700",
  overdue: "bg-rose-50 text-rose-700",
  partial: "bg-amber-50 text-amber-700",
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
    draft: "bg-slate-300",
    sent: "bg-slate-400",
    paid: "bg-emerald-500",
    overdue: "bg-rose-500",
    partial: "bg-amber-500",
    cancelled: "bg-slate-300",
  };

  return (
    <span className={cn("inline-block w-2 h-2 rounded-full", colors[status])} />
  );
}
