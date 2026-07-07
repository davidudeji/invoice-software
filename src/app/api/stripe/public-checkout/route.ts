import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

// Public checkout endpoint — no auth required; anyone with invoice ID can pay
function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-01-28.clover',
  });
}

export async function POST(req: NextRequest) {
  const { invoiceId } = await req.json();

  if (!invoiceId) {
    return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      client: true,
      items: true,
      user: { include: { settings: true } },
    },
  });

  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }

  if (invoice.status === 'PAID' || invoice.status === 'CANCELLED') {
    return NextResponse.json({ error: 'This invoice has already been settled' }, { status: 400 });
  }

  const settings = invoice.user.settings;
  const currency = (settings?.currency || 'USD').toLowerCase();

  try {
    const stripe = getStripeClient();
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: invoice.client.email,
      line_items: invoice.items.map((item) => ({
        price_data: {
          currency,
          product_data: { name: item.description },
          unit_amount: Math.round(item.unitPrice * 100),
        },
        quantity: item.quantity,
      })),
      metadata: {
        invoiceId: invoice.id,
        invoiceNumber: invoice.number,
        userId: invoice.userId,
      },
      success_url: `${baseUrl}/invoice/${invoice.id}?payment=success`,
      cancel_url: `${baseUrl}/invoice/${invoice.id}?payment=cancelled`,
    });

    // Store session ID
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { stripePaymentIntentId: checkoutSession.id },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('[public-checkout]', error);
    return NextResponse.json(
      { error: 'Failed to create payment session. Please try again.' },
      { status: 500 }
    );
  }
}
