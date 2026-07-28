"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 rounded-full disabled:opacity-40 disabled:cursor-not-allowed select-none";

  const variants = {
    primary:
      "text-[#f8fafc] border border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.18)] hover:bg-[rgba(255,255,255,0.07)]",
    accent:
      "bg-[#3b82f6] text-white shadow-[0_2px_12px_rgba(59,130,246,0.35)] hover:bg-[#2563eb] hover:shadow-[0_4px_20px_rgba(59,130,246,0.5)] active:bg-[#1d4ed8]",
    secondary:
      "bg-[rgba(255,255,255,0.06)] text-[#94a3b8] border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.09)] hover:text-[#f8fafc]",
    ghost:
      "text-[#94a3b8] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#f8fafc]",
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3 text-base",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      style={
        variant === "primary"
          ? { background: "rgba(255,255,255,0.05)" }
          : undefined
      }
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </>
      ) : (
        children
      )}
    </button>
  );
}
