import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { AppSidebar } from '@/components/Layout/AppSidebar';
import { SettingsTabs } from '@/components/Settings/SettingsTabs';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Settings' };

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const [settings, taxRates, paymentMethods] = await Promise.all([
    prisma.settings.findUnique({ where: { userId: session.user.id } }),
    prisma.taxRate.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: 'desc' } }),
    prisma.paymentMethod.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: 'desc' } }),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <AppSidebar />
      <main className="pl-64 min-h-screen">
        <div className="max-w-5xl mx-auto p-8 space-y-6 page-enter">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Manage your company profile, branding, taxes, and payment methods
            </p>
          </div>
          <SettingsTabs
            settings={settings}
            taxRates={taxRates}
            paymentMethods={paymentMethods}
          />
        </div>
      </main>
    </div>
  );
}
