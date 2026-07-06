import { z } from 'zod';

// --- Customer / Client Validators ---
export const CustomerCreateSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    companyName: z.string().optional(),
    address: z.string().optional(),
    website: z.string().optional(),
    taxId: z.string().optional(),
    notes: z.string().optional(),
    tags: z.string().optional(),
});

export const CustomerUpdateSchema = CustomerCreateSchema.partial();


// --- Invoice Validators ---
export const InvoiceItemSchema = z.object({
    description: z.string().min(1, 'Description is required'),
    quantity: z.number().positive(),
    unitPrice: z.number().positive(),
    productId: z.string().optional()
});

export const InvoiceCreateSchema = z.object({
    clientId: z.string().min(1, 'Client ID is required'),
    number: z.string().min(1),
    date: z.coerce.date(),
    dueDate: z.coerce.date(),
    status: z.enum(['DRAFT', 'SENT', 'PAID', 'PARTIALLY_PAID', 'OVERDUE', 'CANCELLED']).default('DRAFT'),
    paymentTerms: z.string().optional(),
    notes: z.string().optional(),
    items: z.array(InvoiceItemSchema).min(1, 'At least one item is required'),
    // Subtotal/Tax/Total will be calculated by the service Layer
});

export const InvoiceUpdateSchema = InvoiceCreateSchema.partial().omit({ clientId: true });

// --- Payment Validators ---
export const PaymentCreateSchema = z.object({
    invoiceId: z.string().min(1, 'Invoice ID is required'),
    amount: z.number().positive('Payment amount must be greater than zero'),
    method: z.string().min(1),
    reference: z.string().optional(),
    date: z.coerce.date().default(() => new Date())
});
