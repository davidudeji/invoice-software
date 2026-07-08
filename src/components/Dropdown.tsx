"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "danger";
}

interface DropdownProps {
  items: DropdownItem[];
  trigger: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}

export function Dropdown({
  items,
  trigger,
  align = "right",
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={cn("relative inline-block", className)} ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        {trigger}
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute top-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50",
            "min-w-[200px]",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              disabled={item.disabled}
              className={cn(
                "w-full px-4 py-2.5 text-sm text-left flex items-center gap-3",
                "hover:bg-slate-50 transition-colors",
                "border-b border-slate-100 last:border-b-0",
                item.disabled && "opacity-50 cursor-not-allowed",
                item.variant === "danger" && "text-rose-600 hover:bg-rose-50",
              )}
            >
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface SimpleDropdownProps {
  label: string;
  items: DropdownItem[];
  className?: string;
}

export function SimpleDropdown({
  label,
  items,
  className,
}: SimpleDropdownProps) {
  return (
    <Dropdown
      trigger={
        <span className="flex items-center gap-2 font-semibold text-slate-900">
          {label}
          <ChevronDown size={18} />
        </span>
      }
      items={items}
      className={className}
    />
  );
}

interface SelectMenuProps {
  options: Array<{ value: string; label: string; icon?: React.ReactNode }>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SelectMenu({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className,
}: SelectMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={cn("relative inline-block w-full", className)} ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900",
          "text-sm text-left flex items-center justify-between",
          "hover:border-slate-300 transition-colors",
          "focus:outline-none focus:border-emerald-500",
        )}
      >
        <span className={selectedOption ? "text-slate-900" : "text-slate-400"}>
          {selectedOption ? (
            <span className="flex items-center gap-2">
              {selectedOption.icon}
              {selectedOption.label}
            </span>
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown
          size={18}
          className={cn(
            "text-slate-400 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50",
          )}
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "w-full px-4 py-2.5 text-sm text-left flex items-center gap-3",
                "hover:bg-slate-50 transition-colors",
                "border-b border-slate-100 last:border-b-0",
                value === option.value && "bg-emerald-50 text-emerald-700",
              )}
            >
              {option.icon && (
                <span className="flex-shrink-0">{option.icon}</span>
              )}
              <span>{option.label}</span>
              {value === option.value && (
                <span className="ml-auto text-emerald-600">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
