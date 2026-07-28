"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  children: React.ReactNode;
}

export function Card({
  elevated = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl transition-all duration-200",
        elevated
          ? "shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
          : "shadow-[0_1px_3px_rgba(0,0,0,0.4)]",
        className,
      )}
      style={{
        background: elevated ? "#1a1b24" : "#16171e",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
  children,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 pb-4",
        className,
      )}
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      {...props}
    >
      <div className="flex-1 min-w-0">
        {title && (
          <h3
            className="text-base font-semibold"
            style={{ color: "#f8fafc", fontFamily: '"Syne", sans-serif' }}
          >
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>
            {subtitle}
          </p>
        )}
        {children && !title && children}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardBody({ className, children, ...props }: CardBodyProps) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 px-6 py-4",
        className,
      )}
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      {...props}
    >
      {children}
    </div>
  );
}
