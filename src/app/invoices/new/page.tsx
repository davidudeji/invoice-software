import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AppSidebar } from "@/components/Layout/AppSidebar";
import { InvoiceBuilderForm } from "@/components/Invoices/InvoiceBuilderForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "New Invoice" };

export default async function NewInvoicePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [clients, products, settings] = await Promise.all([
    prisma.client.findMany({
      where: { userId: session.user.id },
      orderBy: { name: "asc" },
    }),
    prisma.product.findMany({
      where: { userId: session.user.id, isActive: true },
      include: { category: { select: { name: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.settings.findUnique({ where: { userId: session.user.id } }),
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
      <AppSidebar />
      <main className="pl-64 min-h-screen">
        <div className="max-w-[1400px] mx-auto p-8 page-enter">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/invoices"
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-200"
            >
              <ChevronLeft size={18} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">New Invoice</h1>
              <p className="text-slate-500 text-sm mt-0.5">
                Create and optionally send an invoice to a client.
              </p>
            </div>
          </div>

          <InvoiceBuilderForm
            clients={clients}
            products={products}
            defaultTaxRate={settings?.taxRate ?? 0}
            currency={settings?.currency ?? "USD"}
            businessName={settings?.businessName ?? "Your Business"}
            logoUrl={settings?.logoUrl ?? null}
          />
        </div>
      </main>
    </div>
  );
}
