'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { writeAuditLog } from '@/lib/audit';
import { sendInvoiceEmail } from '@/lib/email';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import type { ActionState } from '@/types';
import { InvoiceStatus } from '@prisma/client';

// ─────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────

const InvoiceItemSchema = z.object({
  productId: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
  unitPrice: z.coerce.number().min(0, 'Price must be non-negative'),
});

const CreateInvoiceSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  taxRate: z.coerce.number().min(0).max(100).default(0),
  notes: z.string().optional(),
  paymentTerms: z.string().optional(),
  items: z.array(InvoiceItemSchema).min(1, 'At least one item is required'),
  sendEmail: z.boolean().default(false),
});

// ─────────────────────────────────────────────
// CREATE INVOICE
// ─────────────────────────────────────────────

export async function createInvoice(
  prevState: ActionState,
  payload: {
    clientId: string;
    dueDate: string;
    taxRate: number;
    notes: string;
    paymentTerms: string;
    sendEmail: boolean;
    items: { productId?: string; description: string; quantity: number; unitPrice: number }[];
  }
): Promise<ActionState> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { message: 'Not authenticated' };

  const validated = CreateInvoiceSchema.safeParse(payload);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: 'Validation failed.' };
  }

  const { clientId, dueDate, taxRate, notes, paymentTerms, items, sendEmail } = validated.data;

  // Compute totals
  const itemsWithTotals = items.map((item) => ({
    ...item,
    total: item.quantity * item.unitPrice,
  }));
  const subtotal = itemsWithTotals.reduce((sum, i) => sum + i.total, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  // Generate invoice number
  const settings = await prisma.settings.findUnique({ where: { userId } });
  const prefix = settings?.invoicePrefix || 'INV-';
  const count = await prisma.invoice.count({ where: { userId } });
  const invoiceNumber = `${prefix}${String(count + 1).padStart(4, '0')}`;

  let invoiceId: string;

  try {
    const invoice = await prisma.$transaction(async (tx) => {
      // Create invoice
      const newInvoice = await tx.invoice.create({
        data: {
          userId,
          clientId,
          number: invoiceNumber,
          status: sendEmail ? InvoiceStatus.SENT : InvoiceStatus.DRAFT,
          dueDate: new Date(dueDate),
          subtotal,
          taxAmount,
          total,
          taxRate,
          notes: notes || undefined,
          paymentTerms: paymentTerms || undefined,
          sentAt: sendEmail ? new Date() : undefined,
          items: {
            create: itemsWithTotals.map((item) => ({
              productId: item.productId || undefined,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.total,
            })),
          },
        },
        include: {
          client: true,
          items: { include: { product: { select: { name: true } } } },
        },
      });

      // Deduct stock for products with finite stock
      for (const item of itemsWithTotals) {
        if (item.productId) {
          const product = await tx.product.findUnique({ where: { id: item.productId } });
          if (product && product.stockQuantity > 0) {
            await tx.product.update({
              where: { id: item.productId },
              data: { stockQuantity: Math.max(0, product.stockQuantity - item.quantity) },
            });
          }
        }
      }

      return newInvoice;
    });

    invoiceId = invoice.id;

    await writeAuditLog({
      userId,
      action: 'CREATE',
      target: 'INVOICE',
      targetId: invoice.id,
      summary: `Created invoice ${invoiceNumber} for ${invoice.client.name} — total ${total.toFixed(2)}`,
    });

    // Send email if requested
    if (sendEmail) {
      const fullInvoice = await prisma.invoice.findUnique({
        where: { id: invoice.id },
        include: { client: true, items: { include: { product: { select: { name: true } } } } },
      });
      if (fullInvoice) {
        await sendInvoiceEmail(fullInvoice, settings);
      }
    }
  } catch (error) {
    console.error('createInvoice:', error);
    return { message: 'Database error: Failed to create invoice.' };
  }

  revalidatePath('/invoices');
  revalidatePath('/dashboard');
  revalidatePath('/sales');
  redirect(`/invoices/${invoiceId!}`);
}

// ─────────────────────────────────────────────
// UPDATE INVOICE STATUS
// ─────────────────────────────────────────────

export async function updateInvoiceStatus(
  invoiceId: string,
  status: InvoiceStatus
): Promise<ActionState> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { message: 'Not authenticated' };

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId, userId },
      include: { client: true },
    });
    if (!invoice) return { message: 'Invoice not found.' };

    const updateData: Record<string, unknown> = { status };
    if (status === InvoiceStatus.SENT && !invoice.sentAt) updateData.sentAt = new Date();
    if (status === InvoiceStatus.PAID && !invoice.paidAt) updateData.paidAt = new Date();

    await prisma.$transaction(async (tx) => {
      await tx.invoice.update({ where: { id: invoiceId }, data: updateData });

      // Auto-create Sale when marking as PAID
      if (status === InvoiceStatus.PAID) {
        const existing = await tx.sale.findUnique({ where: { invoiceId } });
        if (!existing) {
          await tx.sale.create({
            data: {
              userId,
              invoiceId,
              totalAmount: invoice.total,
              saleDate: new Date(),
            },
          });
        }
      }
    });

    await writeAuditLog({
      userId,
      action: 'UPDATE',
      target: 'INVOICE',
      targetId: invoiceId,
      summary: `Invoice ${invoice.number} status changed to ${status}`,
    });
  } catch (error) {
    console.error('updateInvoiceStatus:', error);
    return { message: 'Database error: Failed to update invoice status.' };
  }

  revalidatePath('/invoices');
  revalidatePath(`/invoices/${invoiceId}`);
  revalidatePath('/dashboard');
  revalidatePath('/sales');
  return { success: true, message: `Invoice marked as ${status}` };
}

// ─────────────────────────────────────────────
// DELETE INVOICE
// ─────────────────────────────────────────────

export async function deleteInvoice(invoiceId: string): Promise<ActionState> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { message: 'Not authenticated' };

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId, userId },
    });
    if (!invoice) return { message: 'Invoice not found.' };

    await prisma.invoice.delete({ where: { id: invoiceId } });

    await writeAuditLog({
      userId,
      action: 'DELETE',
      target: 'INVOICE',
      targetId: invoiceId,
      summary: `Deleted invoice ${invoice.number}`,
    });
  } catch (error) {
    console.error('deleteInvoice:', error);
    return { message: 'Database error: Failed to delete invoice.' };
  }

  revalidatePath('/invoices');
  revalidatePath('/dashboard');
  redirect('/invoices');
}

// ─────────────────────────────────────────────
// GET INVOICES (paginated + filtered)
// ─────────────────────────────────────────────

export async function getInvoices(filters?: {
  status?: InvoiceStatus;
  clientId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}) {
  const session = await auth();
  if (!session?.user?.id) return { invoices: [], total: 0 };

  const page = filters?.page || 1;
  const pageSize = filters?.pageSize || 20;

  const where = {
    userId: session.user.id,
    ...(filters?.status && { status: filters.status }),
    ...(filters?.clientId && { clientId: filters.clientId }),
    ...(filters?.search && {
      OR: [
        { number: { contains: filters.search, mode: 'insensitive' as const } },
        { client: { name: { contains: filters.search, mode: 'insensitive' as const } } },
      ],
    }),
    ...(filters?.dateFrom || filters?.dateTo
      ? {
          date: {
            ...(filters.dateFrom && { gte: new Date(filters.dateFrom) }),
            ...(filters.dateTo && { lte: new Date(filters.dateTo) }),
          },
        }
      : {}),
  };

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      include: { client: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.invoice.count({ where }),
  ]);

  return { invoices, total };
}

// ─────────────────────────────────────────────
// GET SINGLE INVOICE
// ─────────────────────────────────────────────

export async function getInvoiceById(id: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.invoice.findUnique({
    where: { id, userId: session.user.id },
    include: {
      client: true,
      items: { include: { product: { select: { name: true, sku: true } } } },
      payments: true,
    },
  });
}

// ─────────────────────────────────────────────
// RESEND INVOICE EMAIL
// ─────────────────────────────────────────────

export async function resendInvoiceEmail(invoiceId: string): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { message: 'Not authenticated' };

  try {
    const [invoice, settings] = await Promise.all([
      prisma.invoice.findUnique({
        where: { id: invoiceId, userId: session.user.id },
        include: { client: true, items: { include: { product: { select: { name: true } } } } },
      }),
      prisma.settings.findUnique({ where: { userId: session.user.id } }),
    ]);

    if (!invoice) return { message: 'Invoice not found.' };

    await sendInvoiceEmail(invoice, settings);

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { sentAt: new Date(), status: InvoiceStatus.SENT },
    });

    revalidatePath(`/invoices/${invoiceId}`);
    return { success: true, message: 'Invoice email sent.' };
  } catch (error) {
    console.error('resendInvoiceEmail:', error);
    return { message: 'Failed to send invoice email.' };
  }
}
