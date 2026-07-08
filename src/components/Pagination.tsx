"use client";

import React from "react";
import { Button } from "@/components/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  maxVisiblePages = 5,
}: PaginationProps) {
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  // Calculate page numbers to show
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm text-slate-600">
        Page <span className="font-semibold">{currentPage}</span> of{" "}
        <span className="font-semibold">{totalPages}</span>
      </span>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          disabled={!canGoPrev}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
        </Button>

        {showPageNumbers && (
          <div className="flex items-center gap-1">
            {startPage > 1 && (
              <>
                <Button
                  variant={currentPage === 1 ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => onPageChange(1)}
                >
                  1
                </Button>
                {startPage > 2 && (
                  <span className="px-2 text-slate-400">...</span>
                )}
              </>
            )}

            {pages.map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            ))}

            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && (
                  <span className="px-2 text-slate-400">...</span>
                )}
                <Button
                  variant={currentPage === totalPages ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => onPageChange(totalPages)}
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          disabled={!canGoNext}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );
}
