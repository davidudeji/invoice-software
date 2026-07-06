import { NextRequest, NextResponse } from "next/server";
import { createWorker } from "tesseract.js";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface OCRLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface OCRResult {
  vendorName?: string;
  items: OCRLineItem[];
  taxAmount?: number;
  total?: number;
  dueDate?: string;
  rawText?: string;
}

// ─────────────────────────────────────────────
// Text parsing helpers
// ─────────────────────────────────────────────

/** Extract a dollar amount from a string */
function extractAmount(str: string): number | null {
  const match = str.match(/\$?\s*([\d,]+(?:\.\d{2})?)/);
  if (match) return parseFloat(match[1].replace(/,/g, ""));
  return null;
}

/** Parse line items from OCR text */
function parseLineItems(text: string): OCRLineItem[] {
  const items: OCRLineItem[] = [];
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  // Pattern: "Description ... qty ... price"
  const lineItemPattern = /^(.+?)\s+(\d+)\s+x?\s*\$?([\d,]+\.?\d*)\s*$/i;
  // Pattern: "Description ... $amount"
  const simplePattern = /^(.+?)\s+\$?([\d,]+\.\d{2})\s*$/;

  for (const line of lines) {
    // Skip header/total lines
    if (/^(description|item|product|service|total|subtotal|tax|due|invoice|date|bill)/i.test(line)) continue;
    if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(line)) continue;

    const m1 = line.match(lineItemPattern);
    if (m1) {
      const desc = m1[1].trim();
      const qty = parseInt(m1[2]) || 1;
      const price = parseFloat(m1[3].replace(/,/g, "")) || 0;
      if (desc && price > 0) {
        items.push({ description: desc, quantity: qty, unitPrice: price });
      }
      continue;
    }

    const m2 = line.match(simplePattern);
    if (m2) {
      const desc = m2[1].trim();
      const price = parseFloat(m2[2].replace(/,/g, "")) || 0;
      if (desc && price > 0 && desc.length > 2) {
        items.push({ description: desc, quantity: 1, unitPrice: price });
      }
    }
  }

  return items;
}

/** Extract vendor/company name — typically the first non-empty line */
function extractVendorName(text: string): string | undefined {
  const lines = text.split("\n").map((l) => l.trim()).filter((l) => l.length > 2);
  // Return first line that looks like a company name (not a date/number)
  for (const line of lines.slice(0, 5)) {
    if (!/^\d/.test(line) && !/^(invoice|bill|receipt)/i.test(line)) {
      return line;
    }
  }
  return lines[0];
}

/** Extract total amount */
function extractTotal(text: string): number | undefined {
  const lines = text.split("\n").map((l) => l.trim());
  for (const line of lines) {
    if (/total\s*due/i.test(line) || /amount\s*due/i.test(line) || /grand\s*total/i.test(line)) {
      const amount = extractAmount(line);
      if (amount) return amount;
    }
  }
  // Fallback: find the largest dollar amount
  for (const line of [...lines].reverse()) {
    if (/total/i.test(line)) {
      const amount = extractAmount(line);
      if (amount) return amount;
    }
  }
  return undefined;
}

/** Extract tax amount */
function extractTax(text: string): number | undefined {
  const lines = text.split("\n").map((l) => l.trim());
  for (const line of lines) {
    if (/\btax\b/i.test(line) || /\bvat\b/i.test(line) || /\bgst\b/i.test(line)) {
      const amount = extractAmount(line);
      if (amount) return amount;
    }
  }
  return undefined;
}

/** Extract a due date */
function extractDueDate(text: string): string | undefined {
  const lines = text.split("\n").map((l) => l.trim());
  for (const line of lines) {
    if (/due\s*(date|by|on)/i.test(line)) {
      // Look for date patterns: MM/DD/YYYY, DD-MM-YYYY, Month DD YYYY
      const dateMatch = line.match(
        /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})|([A-Za-z]+\s+\d{1,2},?\s+\d{4})/
      );
      if (dateMatch) {
        const parsed = new Date(dateMatch[0]);
        if (!isNaN(parsed.getTime())) {
          return parsed.toISOString().split("T")[0];
        }
      }
    }
  }
  return undefined;
}

// ─────────────────────────────────────────────
// Route Handler
// ─────────────────────────────────────────────

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      return NextResponse.json({ error: "File must be an image or PDF" }, { status: 400 });
    }

    // Convert to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Run Tesseract OCR
    const worker = await createWorker("eng");
    const { data } = await worker.recognize(buffer);
    await worker.terminate();

    const rawText = data.text;

    // Parse the extracted text
    const result: OCRResult = {
      vendorName: extractVendorName(rawText),
      items: parseLineItems(rawText),
      total: extractTotal(rawText),
      taxAmount: extractTax(rawText),
      dueDate: extractDueDate(rawText),
      rawText: process.env.NODE_ENV === "development" ? rawText : undefined,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("[OCR] Error:", error);
    return NextResponse.json(
      { error: "OCR processing failed. Please try again." },
      { status: 500 }
    );
  }
}
