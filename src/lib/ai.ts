import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ReportData } from '@/types';

// ─────────────────────────────────────────────
// Gemini Client
// ─────────────────────────────────────────────

let genAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!genAI) {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is not set');
    }
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  }
  return genAI;
}

// ─────────────────────────────────────────────
// Generate AI Business Summary
// ─────────────────────────────────────────────

export async function generateBusinessSummary(data: ReportData): Promise<string> {
  const client = getClient();
  const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const topProductsList = data.topProducts
    .slice(0, 5)
    .map((p, i) => `${i + 1}. ${p.name} — ${p.quantity} units sold, ${p.revenue.toFixed(2)} revenue`)
    .join('\n');

  const prompt = `You are a senior business analyst. Analyze the following financial data for a business and produce a concise, professional executive summary. The summary should:
- Be written in plain business English (no markdown, no bullet points, just paragraphs)
- Highlight key performance indicators
- Identify trends (positive or negative)
- Note any risks (high outstanding debt, overdue invoices)
- Recommend 2-3 specific, actionable next steps
- Be between 250-400 words

---
REPORT PERIOD: ${data.dateFrom} to ${data.dateTo}
TOTAL REVENUE: ${data.totalRevenue.toFixed(2)}
TOTAL SALES COUNT: ${data.totalSalesCount}
OUTSTANDING DEBT: ${data.outstandingDebt.toFixed(2)}
OVERDUE INVOICES: ${data.overdueCount}

TOP SELLING PRODUCTS:
${topProductsList || 'No sales data available'}

REVENUE BY PERIOD:
${data.revenueByPeriod.map((r) => `${r.label}: ${r.revenue.toFixed(2)}`).join('\n')}
---

Write the executive summary now:`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}
