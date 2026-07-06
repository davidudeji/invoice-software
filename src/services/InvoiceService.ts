import { InvoiceRepository } from '@/repositories/InvoiceRepository';
import { InvoiceCreateSchema, InvoiceUpdateSchema } from '@/validators';
import { ApiError } from '@/utils/api-response';

export class InvoiceService {
    static async getInvoices(userId: string) {
        if (!userId) throw new ApiError('Unauthorized', 401);
        return InvoiceRepository.findAll(userId);
    }

    static async getInvoiceById(id: string, userId: string) {
        if (!userId) throw new ApiError('Unauthorized', 401);

        const invoice = await InvoiceRepository.findById(id, userId);
        if (!invoice) throw new ApiError('Invoice not found', 404);

        return invoice;
    }

    static async createInvoice(userId: string, data: any) {
        if (!userId) throw new ApiError('Unauthorized', 401);

        const validatedData = InvoiceCreateSchema.safeParse(data);
        if (!validatedData.success) {
            throw new ApiError('Validation Error', 400, validatedData.error.flatten().fieldErrors);
        }

        const input = validatedData.data;

        // Service Level Business Logic: Calculate Extents
        let subtotal = 0;
        const itemsWithTotals = input.items.map(item => {
            const itemTotal = item.quantity * item.unitPrice;
            subtotal += itemTotal;
            return {
                ...item,
                total: itemTotal
            };
        });

        // TODO: Determine from Settings context or allow explicit Tax rates payload
        // For MVPs sake, flat 0% tax calculated here. Can be extended to fetch from TaxRate Repository.
        const taxAmount = 0;
        const totalAndTax = subtotal + taxAmount;

        return InvoiceRepository.create({
            userId,
            clientId: input.clientId,
            number: input.number,
            date: input.date,
            dueDate: input.dueDate,
            status: input.status,
            paymentTerms: input.paymentTerms,
            notes: input.notes,
            subtotal,
            taxAmount,
            total: totalAndTax,
        }, itemsWithTotals);
    }

    static async updateInvoiceStatus(id: string, userId: string, payload: { status: string }) {
        if (!userId) throw new ApiError('Unauthorized', 401);

        const invoice = await InvoiceRepository.findById(id, userId);
        if (!invoice) throw new ApiError('Invoice not found', 404);

        if (!['DRAFT', 'SENT', 'PAID', 'PARTIALLY_PAID', 'OVERDUE', 'CANCELLED'].includes(payload.status)) {
            throw new ApiError('Invalid Status Configuration', 400);
        }

        return InvoiceRepository.update(id, userId, { status: payload.status as 'DRAFT' | 'SENT' | 'PAID' | 'PARTIALLY_PAID' | 'OVERDUE' | 'CANCELLED' });
    }

    static async deleteInvoice(id: string, userId: string) {
        if (!userId) throw new ApiError('Unauthorized', 401);

        const invoice = await InvoiceRepository.findById(id, userId);
        if (!invoice) throw new ApiError('Invoice not found', 404);

        return InvoiceRepository.delete(id, userId);
    }

    static async generateInvoicePDF(id: string, userId: string) {
        const invoice = await this.getInvoiceById(id, userId);
        // Placeholder logic. To be mapped to a real PDF generation service using Headless browser or PDF lib
        return {
            buffer: Buffer.from(`MOCK_PDF_DATA_FOR_${invoice.number}`),
            filename: `Invoice_${invoice.number}.pdf`
        }
    }
}
