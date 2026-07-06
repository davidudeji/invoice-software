import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { AppSidebar } from '@/components/Layout/AppSidebar';
import { AIReportClient } from '@/components/Reports/AIReportClient';
import { getReportData } from '@/app/actions/reports';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Reports & Insights' };

export default async function ReportsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const initialData = await getReportData(thirtyDaysAgo, today);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <AppSidebar />
      <main className="pl-64 min-h-screen">
        <div className="max-w-[1400px] mx-auto p-8 space-y-6 page-enter">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Reports & Insights</h1>
              <p className="text-slate-500 text-sm mt-0.5">
                Analyse revenue, top products, and generate AI-powered executive summaries
              </p>
            </div>
          </div>

          <AIReportClient initialData={initialData} />
        </div>
      </main>
    </div>
  );
}
