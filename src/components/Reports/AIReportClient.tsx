'use client';

import { useState, useTransition } from 'react';
import { generateAISummary, getReportData } from '@/app/actions/reports';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Sparkles, Loader2, Calendar, TrendingUp, Package, AlertCircle, RefreshCw } from 'lucide-react';
import type { ReportData } from '@/types';

interface Props {
  initialData: ReportData;
}

export function AIReportClient({ initialData }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [dateFrom, setDateFrom] = useState(initialData.dateFrom || thirtyDaysAgo);
  const [dateTo, setDateTo] = useState(initialData.dateTo || today);
  const [reportData, setReportData] = useState<ReportData>(initialData);
  const [aiSummary, setAiSummary] = useState('');
  const [aiError, setAiError] = useState('');
  const [isLoadingReport, startReportTransition] = useTransition();
  const [isGeneratingAI, startAITransition] = useTransition();

  function fetchReport() {
    startReportTransition(async () => {
      const data = await getReportData(dateFrom, dateTo);
      setReportData(data);
      setAiSummary('');
    });
  }

  function generateSummary() {
    setAiError('');
    startAITransition(async () => {
      try {
        const { summary } = await generateAISummary(dateFrom, dateTo);
        setAiSummary(summary);
      } catch {
        setAiError('Failed to generate AI summary. Check your API key configuration.');
      }
    });
  }

  const currency = 'USD';
  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2 }).format(n);

  return (
    <div className="space-y-6">
      {/* Date Range Filter */}
      <div className="card p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Calendar size={16} className="text-indigo-500" />
          Report Period
        </div>
        <div className="flex flex-col sm:flex-row gap-2 items-center flex-1">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
          <span className="text-slate-400 text-sm">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
          <button
            onClick={fetchReport}
            disabled={isLoadingReport}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            {isLoadingReport ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            Refresh
          </button>
          <button
            onClick={generateSummary}
            disabled={isGeneratingAI}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50"
          >
            {isGeneratingAI ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {isGeneratingAI ? 'Generating…' : 'AI Summary'}
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: fmt(reportData.totalRevenue), color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Total Sales', value: reportData.totalSalesCount.toString(), color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Outstanding Debt', value: fmt(reportData.outstandingDebt), color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Overdue Invoices', value: reportData.overdueCount.toString(), color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat) => (
          <div key={stat.label} className={`card p-5 ${isLoadingReport ? 'opacity-50' : ''}`}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue by Period */}
        <div className={`card p-6 ${isLoadingReport ? 'opacity-50' : ''}`}>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={16} className="text-indigo-500" />
            <h3 className="text-sm font-semibold text-slate-900">Revenue by Period</h3>
          </div>
          {reportData.revenueByPeriod.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={reportData.revenueByPeriod} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  formatter={(value: number | string) => [fmt(Number(value || 0)), 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#revenueGrad)" dot={{ fill: '#6366f1', r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-slate-400 text-sm">
              No sales in this period
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className={`card p-6 ${isLoadingReport ? 'opacity-50' : ''}`}>
          <div className="flex items-center gap-2 mb-6">
            <Package size={16} className="text-indigo-500" />
            <h3 className="text-sm font-semibold text-slate-900">Top Products by Revenue</h3>
          </div>
          {reportData.topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={reportData.topProducts.slice(0, 6)} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={90} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  formatter={(value: number | string) => [fmt(Number(value || 0)), 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#6366f1" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-slate-400 text-sm">
              No product sales in this period
            </div>
          )}
        </div>
      </div>

      {/* AI Summary */}
      {aiError && (
        <div className="card p-5 flex items-start gap-3 border-red-200 bg-red-50/50">
          <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-600">{aiError}</p>
        </div>
      )}

      {(aiSummary || isGeneratingAI) && (
        <div className="card p-6 border-indigo-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">AI Business Summary</h3>
            <span className="text-xs text-slate-400 ml-1">powered by Gemini</span>
          </div>
          {isGeneratingAI ? (
            <div className="flex items-center gap-3 py-6 text-slate-500">
              <Loader2 size={18} className="animate-spin text-indigo-500" />
              <span className="text-sm">Analysing your financial data…</span>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              {aiSummary.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-slate-700 leading-relaxed mb-4 last:mb-0 text-sm">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
            <Calendar size={12} />
            Period: {dateFrom} to {dateTo}
          </div>
        </div>
      )}

      {!aiSummary && !isGeneratingAI && (
        <div className="card p-8 text-center border-dashed border-2 border-slate-200">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center mb-4">
            <Sparkles size={22} className="text-indigo-500" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">AI Business Insights</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-5">
            Click <strong>AI Summary</strong> to get an executive analysis of your revenue, trends, risks, and recommended next steps — powered by Gemini.
          </p>
          <button
            onClick={generateSummary}
            disabled={isGeneratingAI}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
          >
            <Sparkles size={14} />
            Generate AI Summary
          </button>
        </div>
      )}
    </div>
  );
}
