"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export function Input({
  label,
  error,
  hint,
  icon,
  iconPosition = "left",
  className,
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          {label}
          {props.required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === "left" && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          className={cn(
            "w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400",
            "transition-colors duration-200",
            "focus:outline-none focus:border-emerald-500 focus:bg-white",
            "disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed",
            error && "border-rose-300 focus:border-rose-500",
            icon && iconPosition === "left" && "pl-10",
            icon && iconPosition === "right" && "pr-10",
            className,
          )}
          {...props}
        />
        {icon && iconPosition === "right" && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-rose-600 mt-1.5">{error}</p>}
      {hint && !error && (
        <p className="text-xs text-slate-500 mt-1.5">{hint}</p>
      )}
    </div>
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function TextArea({
  label,
  error,
  hint,
  className,
  ...props
}: TextAreaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          {label}
          {props.required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        className={cn(
          "w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400",
          "transition-colors duration-200",
          "focus:outline-none focus:border-emerald-500 focus:bg-white",
          "disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed",
          "resize-vertical min-h-[120px]",
          error && "border-rose-300 focus:border-rose-500",
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-rose-600 mt-1.5">{error}</p>}
      {hint && !error && (
        <p className="text-xs text-slate-500 mt-1.5">{hint}</p>
      )}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: Array<{ value: string; label: string }>;
}

export function Select({
  label,
  error,
  hint,
  options,
  className,
  ...props
}: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          {label}
          {props.required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <select
        className={cn(
          "w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900",
          "transition-colors duration-200",
          "focus:outline-none focus:border-emerald-500 focus:bg-white",
          "disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed",
          error && "border-rose-300 focus:border-rose-500",
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-rose-600 mt-1.5">{error}</p>}
      {hint && !error && (
        <p className="text-xs text-slate-500 mt-1.5">{hint}</p>
      )}
    </div>
  );
}
