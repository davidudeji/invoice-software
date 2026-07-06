
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { Mail, Phone, MapPin, Globe, Edit, FileText, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { deleteClient } from '@/app/actions/clients';

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
    const session = await auth();
    if (!session?.user?.id) {
        redirect('/login');
    }

    const { id } = await params;

    const client = await prisma.client.findUnique({
        where: { id, userId: session.user.id },
        include: {
            invoices: {
                orderBy: { date: 'desc' },
                take: 10
            }
        }
    });

    if (!client) {
        notFound();
    }

    // Calculate Stats
    const totalInvoices = client.invoices.length;
    const totalRevenue = client.invoices
        .filter(inv => inv.status === 'PAID')
        .reduce((sum, inv) => sum + inv.total, 0);

    const outstanding = client.invoices
        .filter(inv => inv.status !== 'PAID' && inv.status !== 'DRAFT')
        .reduce((sum, inv) => sum + inv.total, 0);

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">{client.name}</h1>
                    {client.companyName && <p className="text-lg text-slate-500 mt-1">{client.companyName}</p>}
                </div>
                <div className="flex gap-3">
                    <Link
                        href={`/invoices/new?clientId=${client.id}`}
                        className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        <FileText size={16} />
                        New Invoice
                    </Link>
                    <Link
                        href={`/clients/${client.id}/edit`}
                        className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        <Edit size={16} />
                        Edit Profile
                    </Link>
                    <form action={async () => {
                        "use server";
                        await deleteClient(client.id);
                    }}>
                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 transition-colors"
                        >
                            <Trash2 size={16} />
                            Delete
                        </button>
                    </form>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">Total Revenue</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">${totalRevenue.toLocaleString()}</dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">Outstanding</dt>
                    <dd className={`mt-1 text-3xl font-semibold tracking-tight ${outstanding > 0 ? 'text-red-600' : 'text-gray-900'}`}>${outstanding.toLocaleString()}</dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">Total Invoices</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{totalInvoices}</dd>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Details */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white shadow sm:rounded-lg p-6">
                        <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">Contact Details</h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-sm">
                                <Mail className="h-5 w-5 text-gray-400 shrink-0" />
                                <a href={`mailto:${client.email}`} className="text-gray-600 hover:text-indigo-600 truncate">{client.email}</a>
                            </li>
                            {client.phone && (
                                <li className="flex gap-3 text-sm">
                                    <Phone className="h-5 w-5 text-gray-400 shrink-0" />
                                    <a href={`tel:${client.phone}`} className="text-gray-600 hover:text-indigo-600">{client.phone}</a>
                                </li>
                            )}
                            {client.address && (
                                <li className="flex gap-3 text-sm">
                                    <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
                                    <span className="text-gray-600 whitespace-pre-line">{client.address}</span>
                                </li>
                            )}
                            {client.website && (
                                <li className="flex gap-3 text-sm">
                                    <Globe className="h-5 w-5 text-gray-400 shrink-0" />
                                    <a href={client.website} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-indigo-600 truncate">{client.website}</a>
                                </li>
                            )}
                        </ul>

                        {client.taxId && (
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <p className="text-xs text-gray-500">Tax ID / CAC</p>
                                <p className="text-sm font-medium text-gray-900">{client.taxId}</p>
                            </div>
                        )}

                        {client.notes && (
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <p className="text-xs text-gray-500">Internal Notes</p>
                                <p className="text-sm text-gray-600 mt-1">{client.notes}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Invoices */}
                <div className="lg:col-span-2">
                    <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h3 className="text-base font-semibold leading-6 text-gray-900">Recent Invoices</h3>
                        </div>
                        <ul role="list" className="divide-y divide-gray-200 bg-white">
                            {client.invoices.map((invoice) => (
                                <li key={invoice.id} className="px-4 py-5 sm:px-6 hover:bg-gray-50 transition">
                                    <Link href={`/invoices/${invoice.id}`} className="flex justify-between items-center">
                                        <div className="min-w-0 gap-x-4">
                                            <div className="min-w-0 flex-auto">
                                                <p className="text-sm font-semibold leading-6 text-gray-900">
                                                    {invoice.number}
                                                </p>
                                                <p className="mt-1 flex text-xs leading-5 text-gray-500">
                                                    {format(invoice.date, 'MMM d, yyyy')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <p className="text-sm font-medium text-gray-900">${invoice.total.toLocaleString()}</p>
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset 
                                    ${invoice.status === 'PAID' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                                    invoice.status === 'OVERDUE' ? 'bg-red-50 text-red-700 ring-red-600/20' :
                                                        'bg-yellow-50 text-yellow-800 ring-yellow-600/20'}`}>
                                                {invoice.status}
                                            </span>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                            {client.invoices.length === 0 && (
                                <li className="px-4 py-8 text-center text-sm text-gray-500">No invoices found for this client.</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
