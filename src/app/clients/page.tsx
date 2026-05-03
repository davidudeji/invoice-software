
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';

export default async function ClientsPage({
    searchParams,
}: {
    searchParams?: Promise<{ query?: string }>;
}) {
    const session = await auth();
    if (!session?.user?.id) {
        redirect('/login');
    }

    const params = await searchParams;
    const query = params?.query || '';

    const clients = await prisma.client.findMany({
        where: {
            userId: session.user.id,
            OR: [
                { name: { contains: query } },
                { companyName: { contains: query } },
                { email: { contains: query } },
            ],
        },
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { invoices: true },
            },
            invoices: {
                select: {
                    total: true, // we will sum this up in JS or do aggregate query if needed
                    status: true,
                }
            }
        },
    });

    // Calculate stats per client
    const clientsWithStats = clients.map(client => {
        const totalRevenue = client.invoices
            .filter(inv => inv.status === 'PAID')
            .reduce((sum, inv) => sum + inv.total, 0);

        const outstanding = client.invoices
            .filter(inv => inv.status !== 'PAID' && inv.status !== 'DRAFT')
            .reduce((sum, inv) => sum + inv.total, 0);

        return {
            ...client,
            totalRevenue,
            outstanding
        };
    });


    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Clients</h1>
                    <p className="text-slate-500 mt-2">Manage your relationships and view client history.</p>
                </div>
                <Link
                    href="/clients/new"
                    className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    <Plus size={18} />
                    Add Client
                </Link>
            </div>

            {/* Search Bar - Primitive implementation for now */}
            {/* In a real app we'd use a client component for search that updates URL params */}
            <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <form>
                    <input
                        type="text"
                        name="query"
                        defaultValue={query}
                        placeholder="Search clients..."
                        className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </form>
            </div>

            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
                <ul role="list" className="divide-y divide-gray-100">
                    {clientsWithStats.map((client) => (
                        <li key={client.id} className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
                            <div className="flex min-w-0 gap-x-4">
                                <div className="min-w-0 flex-auto">
                                    <p className="text-sm font-semibold leading-6 text-gray-900">
                                        <Link href={`/clients/${client.id}`}>
                                            <span className="absolute inset-x-0 -top-px bottom-0" />
                                            {client.name}
                                        </Link>
                                    </p>
                                    <p className="mt-1 flex text-xs leading-5 text-gray-500">
                                        <a href={`mailto:${client.email}`} className="relative truncate hover:underline">
                                            {client.email}
                                        </a>
                                    </p>
                                    {client.companyName && <p className="text-xs text-gray-400">{client.companyName}</p>}
                                </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-x-4">
                                <div className="hidden sm:flex sm:flex-col sm:items-end">
                                    <p className="text-sm leading-6 text-gray-900">Inv: {client._count.invoices}</p>
                                    {client.outstanding > 0 ? (
                                        <p className="mt-1 text-xs leading-5 text-red-600 font-medium">Due: ${client.outstanding.toLocaleString()}</p>
                                    ) : (
                                        <p className="mt-1 text-xs leading-5 text-gray-500">All paid</p>
                                    )}
                                </div>
                                <svg className="h-5 w-5 flex-none text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </li>
                    ))}
                    {clientsWithStats.length === 0 && (
                        <li className="px-4 py-8 text-center text-sm text-gray-500">
                            No clients found. {query && `for "${query}"`}
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}
