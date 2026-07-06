import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-01-28.clover',
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { invoiceId } = await req.json();
  if (!invoiceId) {
    return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId, userId: session.user.id },
    include: { client: true, items: true },
  });

  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }

  const settings = await prisma.settings.findUnique({ where: { userId: session.user.id } });
  const currency = (settings?.currency || 'USD').toLowerCase();

  try {
    const stripe = getStripeClient();
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: invoice.client.email,
      line_items: invoice.items.map((item) => ({
        price_data: {
          currency,
          product_data: {
            name: item.description,
          },
          unit_amount: Math.round(item.unitPrice * 100),
        },
        quantity: item.quantity,
      })),
      metadata: {
        invoiceId: invoice.id,
        invoiceNumber: invoice.number,
        userId: session.user.id,
      },
      success_url: `${process.env.NEXTAUTH_URL}/invoices/${invoice.id}?payment=success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/invoices/${invoice.id}?payment=cancelled`,
    });

    // Store the session ID on the invoice
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { stripePaymentIntentId: checkoutSession.id },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'Failed to create payment session' }, { status: 500 });
  }
}
