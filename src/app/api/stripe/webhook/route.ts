import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { writeAuditLog } from '@/lib/audit';
import { InvoiceStatus } from '@prisma/client';

function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-01-28.clover',
  });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook signature missing' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripeClient();
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const invoiceId = session.metadata?.invoiceId;
    const userId = session.metadata?.userId;

    if (!invoiceId || !userId) {
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
    }

    try {
      await prisma.$transaction(async (tx) => {
        const invoice = await tx.invoice.update({
          where: { id: invoiceId },
          data: {
            status: InvoiceStatus.PAID,
            paidAt: new Date(),
            stripePaymentIntentId: session.payment_intent as string,
          },
          include: {
            items: { select: { productId: true, quantity: true } },
          },
        });

        // Record payment
        await tx.payment.create({
          data: {
            invoiceId,
            stripeSessionId: session.id,
            amount: invoice.total,
            status: 'PAID',
            paymentMethod: 'card',
            transactionId: session.payment_intent as string,
            paidAt: new Date(),
          },
        });

        // Auto-create Sale record
        const existingSale = await tx.sale.findUnique({ where: { invoiceId } });
        if (!existingSale) {
          await tx.sale.create({
            data: {
              userId,
              invoiceId,
              totalAmount: invoice.total,
              saleDate: new Date(),
              notes: `Stripe payment — session ${session.id}`,
            },
          });
        }

        // Deduct stock for product-linked line items
        for (const item of invoice.items) {
          if (item.productId) {
            const product = await tx.product.findUnique({
              where: { id: item.productId },
              select: { stockQuantity: true },
            });
            if (product && product.stockQuantity > 0) {
              await tx.product.update({
                where: { id: item.productId },
                data: {
                  stockQuantity: Math.max(0, product.stockQuantity - item.quantity),
                },
              });
            }
          }
        }
      });

      await writeAuditLog({
        userId,
        action: 'UPDATE',
        target: 'INVOICE',
        targetId: invoiceId,
        summary: `Invoice marked PAID via Stripe — session ${session.id}`,
      });

      console.log(`[stripe] Invoice ${invoiceId} marked as PAID`);
    } catch (error) {
      console.error('Webhook processing error:', error);
      return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
