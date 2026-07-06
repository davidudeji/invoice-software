"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, Camera } from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface OCRItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface OCRData {
  vendorName?: string;
  items?: OCRItem[];
  taxAmount?: number;
  total?: number;
  dueDate?: string;
}

interface SmartCaptureProps {
  onCapture: (data: OCRData) => void;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export function SmartCapture({ onCapture }: SmartCaptureProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [fileName, setFileName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [extractedSummary, setExtractedSummary] = useState<{
    itemCount: number;
    total?: number;
    vendor?: string;
  } | null>(null);

  const processFile = async (file: File) => {
    setStatus("processing");
    setFileName(file.name);
    setErrorMsg("");
    setExtractedSummary(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "OCR processing failed");
      }

      const data: OCRData = await res.json();

      setStatus("success");
      setExtractedSummary({
        itemCount: data.items?.length ?? 0,
        total: data.total,
        vendor: data.vendorName,
      });

      onCapture(data);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Processing failed. Please try again.");
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type.startsWith("image/") || file.type === "application/pdf")) {
      processFile(file);
    } else {
      setStatus("error");
      setErrorMsg("Please upload an image (JPG, PNG, WebP) or PDF file.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const reset = () => {
    setStatus("idle");
    setFileName("");
    setErrorMsg("");
    setExtractedSummary(null);
  };

  return (
    <div
      className={`
        relative rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden
        ${isDragging ? "border-indigo-400 bg-indigo-50/60" : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50"}
        ${status === "success" ? "border-emerald-300 bg-emerald-50/30" : ""}
        ${status === "error" ? "border-red-300 bg-red-50/20" : ""}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Clickable file input */}
      {status === "idle" && (
        <input
          type="file"
          accept="image/*,application/pdf"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileInput}
          capture="environment" // enables camera on mobile
        />
      )}

      <div className="p-5 text-center">
        {/* Status icons */}
        <div className="mx-auto mb-3 flex items-center justify-center">
          {status === "idle" && (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
                <Upload size={18} className="text-indigo-500" />
              </div>
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center md:hidden">
                <Camera size={18} className="text-slate-500" />
              </div>
            </div>
          )}
          {status === "processing" && (
            <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
              <Loader2 size={20} className="text-indigo-500 animate-spin" />
            </div>
          )}
          {status === "success" && (
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle size={20} className="text-emerald-600" />
            </div>
          )}
          {status === "error" && (
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle size={20} className="text-red-500" />
            </div>
          )}
        </div>

        {/* Text content */}
        {status === "idle" && (
          <>
            <p className="text-sm font-semibold text-slate-700">
              Drop a receipt or invoice image here
            </p>
            <p className="text-xs text-slate-400 mt-1">
              or tap to browse / use camera · PDF, JPG, PNG, WebP
            </p>
            <div className="flex justify-center gap-3 mt-3 text-xs text-slate-400 font-medium">
              {["PDF", "JPG", "PNG", "WebP"].map((fmt) => (
                <span key={fmt} className="flex items-center gap-1">
                  <FileText size={10} /> {fmt}
                </span>
              ))}
            </div>
          </>
        )}

        {status === "processing" && (
          <>
            <p className="text-sm font-semibold text-slate-700">Analysing {fileName}…</p>
            <p className="text-xs text-slate-400 mt-1">
              Extracting vendor, line items, tax & totals
            </p>
          </>
        )}

        {status === "success" && extractedSummary && (
          <>
            <p className="text-sm font-semibold text-emerald-700">Scan complete!</p>
            <p className="text-xs text-slate-500 mt-1">
              {extractedSummary.vendor && <><strong>{extractedSummary.vendor}</strong> · </>}
              {extractedSummary.itemCount} item{extractedSummary.itemCount !== 1 ? "s" : ""} extracted
              {extractedSummary.total != null && <> · Total: ${extractedSummary.total.toFixed(2)}</>}
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-2 text-xs text-indigo-500 hover:text-indigo-700 underline"
            >
              Scan another
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <p className="text-sm font-semibold text-red-600">Scan failed</p>
            <p className="text-xs text-red-400 mt-1">{errorMsg}</p>
            <button
              type="button"
              onClick={reset}
              className="mt-2 text-xs text-indigo-500 hover:text-indigo-700 underline"
            >
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
