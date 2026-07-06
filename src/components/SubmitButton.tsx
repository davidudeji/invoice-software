'use client';

import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

interface SubmitButtonProps {
  children?: React.ReactNode;
  text?: string;
  pendingLabel?: string;
  loadingText?: string;
  className?: string;
}

export function SubmitButton({
  children,
  text,
  pendingLabel,
  loadingText,
  className,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const displayText = children ?? text ?? 'Submit';
  const pendingText = pendingLabel ?? loadingText ?? 'Processing…';

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        'rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all',
        className
      )}
    >
      {pending && <Loader2 size={14} className="animate-spin" />}
      {pending ? pendingText : displayText}
    </button>
  );
}
