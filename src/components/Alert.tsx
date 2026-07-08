"use client";

import React from "react";
import {
  X,
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type AlertType = "info" | "success" | "warning" | "error";

interface AlertProps {
  type: AlertType;
  title?: string;
  message: string;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const alertStyles = {
  info: {
    container: "bg-blue-50 border border-blue-200",
    icon: "text-blue-600",
    title: "text-blue-900",
    message: "text-blue-800",
    action: "text-blue-600 hover:text-blue-700",
    close: "text-blue-400 hover:text-blue-600",
  },
  success: {
    container: "bg-emerald-50 border border-emerald-200",
    icon: "text-emerald-600",
    title: "text-emerald-900",
    message: "text-emerald-800",
    action: "text-emerald-600 hover:text-emerald-700",
    close: "text-emerald-400 hover:text-emerald-600",
  },
  warning: {
    container: "bg-amber-50 border border-amber-200",
    icon: "text-amber-600",
    title: "text-amber-900",
    message: "text-amber-800",
    action: "text-amber-600 hover:text-amber-700",
    close: "text-amber-400 hover:text-amber-600",
  },
  error: {
    container: "bg-rose-50 border border-rose-200",
    icon: "text-rose-600",
    title: "text-rose-900",
    message: "text-rose-800",
    action: "text-rose-600 hover:text-rose-700",
    close: "text-rose-400 hover:text-rose-600",
  },
};

const iconMap = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
};

export function Alert({
  type,
  title,
  message,
  onClose,
  action,
  className,
}: AlertProps) {
  const styles = alertStyles[type];
  const Icon = iconMap[type];

  return (
    <div
      className={cn("flex gap-3 p-4 rounded-lg", styles.container, className)}
    >
      <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", styles.icon)} />

      <div className="flex-1">
        {title && (
          <h4 className={cn("font-semibold text-sm mb-1", styles.title)}>
            {title}
          </h4>
        )}
        <p className={cn("text-sm", styles.message)}>{message}</p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {action && (
          <button
            onClick={action.onClick}
            className={cn(
              "text-sm font-semibold underline transition-colors",
              styles.action,
            )}
          >
            {action.label}
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className={cn("p-1 transition-colors", styles.close)}
            aria-label="Close alert"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
