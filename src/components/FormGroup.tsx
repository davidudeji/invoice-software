"use client";

import React from "react";

interface FormGroupProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

export function FormGroup({
  label,
  required = false,
  hint,
  error,
  children,
}: FormGroupProps) {
  return (
    <div className="w-full space-y-1.5">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-slate-500">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-rose-600">{error}</p>
      )}
    </div>
  );
}
