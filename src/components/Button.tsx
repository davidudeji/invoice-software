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
    "inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-[#0A0A0A] text-white hover:bg-[#1F1F23] active:bg-black focus-visible:ring-2 focus-visible:ring-[#1469F8]",
    accent:
      "bg-[#1469F8] text-white hover:bg-[#0B44C2] active:bg-[#083AB0] shadow-[0_2px_8px_rgba(20,105,248,0.3)] focus-visible:ring-2 focus-visible:ring-[#1469F8]",
    secondary:
      "bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300",
    ghost: "text-slate-600 hover:bg-slate-100 active:bg-slate-200",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
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
