import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AppSidebar } from "@/components/Layout/AppSidebar";
import { InvoiceDetailClient } from "@/components/Invoices/InvoiceDetailClient";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Invoice Detail" };

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment?: string }>;
}

export default async function InvoiceDetailPage({ params, searchParams }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const { payment } = await searchParams;

  const [invoice, settings] = await Promise.all([
    prisma.invoice.findUnique({
      where: { id, userId: session.user.id },
      include: {
        client: true,
        items: {
          include: {
            product: { select: { name: true, sku: true } },
          },
        },
        payments: { orderBy: { createdAt: "desc" } },
        sale: true,
      },
    }),
    prisma.settings.findUnique({ where: { userId: session.user.id } }),
  ]);

  if (!invoice) notFound();

  return (
    <div className="min-h-screen bg-slate-50">
      <AppSidebar />
      <main className="md:pl-64 min-h-screen">
        <div className="max-w-5xl mx-auto p-4 md:p-8 page-enter">
          {/* Back nav */}
          <div className="mb-6">
            <Link
              href="/invoices"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ChevronLeft size={16} />
              Back to Invoices
            </Link>
          </div>

          <InvoiceDetailClient
            invoice={invoice}
            settings={settings}
            paymentStatus={payment}
          />
        </div>
      </main>
    </div>
  );
}
