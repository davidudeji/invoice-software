"use client";

import React from "react";
import { Button } from "@/components/Button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "accent" | "secondary" | "ghost";
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`w-full py-12 px-6 text-center ${className}`}>
      {icon && (
        <div className="mb-4 flex justify-center text-slate-300">{icon}</div>
      )}
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}
      {action && (
        <Button variant={action.variant} onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  size = "md",
  message,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const container = fullScreen ? (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
      <div className="text-center">
        <div
          className={`animate-spin rounded-full border-2 border-slate-200 border-t-emerald-500 ${sizes[size]} mx-auto mb-3`}
        />
        {message && <p className="text-sm text-slate-600">{message}</p>}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center py-8">
      <div
        className={`animate-spin rounded-full border-2 border-slate-200 border-t-emerald-500 ${sizes[size]} mb-3`}
      />
      {message && <p className="text-sm text-slate-600">{message}</p>}
    </div>
  );

  return container;
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`bg-slate-100 rounded-lg animate-pulse ${className}`} />
  );
}

export function SkeletonLine() {
  return <Skeleton className="h-4 w-full mb-2 last:mb-0" />;
}

export function SkeletonCard() {
  return (
    <div className="card p-6">
      <SkeletonLine />
      <SkeletonLine />
      <Skeleton className="h-12 w-full mt-4" />
    </div>
  );
}
