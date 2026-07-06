import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AppSidebar } from '@/components/Layout/AppSidebar';
import { CategoryList } from '@/components/Categories/CategoryList';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Categories' };
export const revalidate = 30;

export default async function CategoriesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const categories = await prisma.category.findMany({
    where: { userId: session.user.id },
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <AppSidebar />
      <main className="pl-64 min-h-screen">
        <div className="max-w-[1400px] mx-auto p-8 space-y-6 page-enter">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Organise your products into categories
            </p>
          </div>
          <CategoryList categories={categories} />
        </div>
      </main>
    </div>
  );
}
