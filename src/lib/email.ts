import nodemailer from 'nodemailer';
import type { Invoice, InvoiceItem, Client, Settings } from '@prisma/client';

// ─────────────────────────────────────────────
// Transporter
// ─────────────────────────────────────────────

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type InvoiceWithRelations = Invoice & {
  client: Client;
  items: (InvoiceItem & { product?: { name: string } | null })[];
};

// ─────────────────────────────────────────────
// HTML Email Template
// ─────────────────────────────────────────────

function buildInvoiceEmailHTML(invoice: InvoiceWithRelations, settings: Settings | null): string {
  const currency = settings?.currency || 'USD';
  const businessName = settings?.businessName || 'Your Business';
  const logoUrl = settings?.logoUrl;
  const invoiceUrl = `${process.env.NEXTAUTH_URL}/invoices/${invoice.id}`;

  const lineItems = invoice.items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #f1f5f9;color:#334155;">${item.description}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #f1f5f9;color:#64748b;text-align:center;">${item.quantity}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #f1f5f9;color:#334155;text-align:right;">${currency} ${item.unitPrice.toFixed(2)}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #f1f5f9;color:#334155;font-weight:600;text-align:right;">${currency} ${item.total.toFixed(2)}</td>
      </tr>`
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invoice ${invoice.number}</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.06);overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1 0%,#4f46e5 100%);padding:32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    ${logoUrl ? `<img src="${logoUrl}" alt="${businessName}" style="height:48px;object-fit:contain;border-radius:8px;" />` : `<div style="color:#fff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">${businessName}</div>`}
                  </td>
                  <td align="right">
                    <div style="color:rgba(255,255,255,0.8);font-size:12px;text-transform:uppercase;letter-spacing:1px;">Invoice</div>
                    <div style="color:#ffffff;font-size:22px;font-weight:700;">${invoice.number}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Bill To / Dates -->
          <tr>
            <td style="padding:32px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:50%;vertical-align:top;">
                    <div style="font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Bill To</div>
                    <div style="font-size:18px;font-weight:700;color:#0f172a;">${invoice.client.name}</div>
                    ${invoice.client.companyName ? `<div style="font-size:14px;color:#64748b;">${invoice.client.companyName}</div>` : ''}
                    <div style="font-size:14px;color:#64748b;">${invoice.client.email}</div>
                    ${invoice.client.address ? `<div style="font-size:14px;color:#64748b;">${invoice.client.address}</div>` : ''}
                  </td>
                  <td style="width:50%;vertical-align:top;text-align:right;">
                    <table cellpadding="4" cellspacing="0" align="right">
                      <tr>
                        <td style="font-size:13px;color:#94a3b8;text-align:right;">Issue Date:</td>
                        <td style="font-size:13px;color:#334155;font-weight:600;padding-left:12px;">${new Date(invoice.date).toLocaleDateString()}</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#94a3b8;text-align:right;">Due Date:</td>
                        <td style="font-size:13px;color:#ef4444;font-weight:600;padding-left:12px;">${new Date(invoice.dueDate).toLocaleDateString()}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding:32px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;overflow:hidden;border:1px solid #f1f5f9;">
                <thead>
                  <tr style="background:#f8fafc;">
                    <th style="padding:12px 16px;text-align:left;font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Description</th>
                    <th style="padding:12px 16px;text-align:center;font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Qty</th>
                    <th style="padding:12px 16px;text-align:right;font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Unit Price</th>
                    <th style="padding:12px 16px;text-align:right;font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${lineItems}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Totals -->
          <tr>
            <td style="padding:24px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:60%"></td>
                  <td style="width:40%;">
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="font-size:14px;color:#64748b;">Subtotal</td>
                        <td style="font-size:14px;color:#334155;font-weight:500;text-align:right;">${currency} ${invoice.subtotal.toFixed(2)}</td>
                      </tr>
                      ${invoice.taxAmount > 0 ? `
                      <tr>
                        <td style="font-size:14px;color:#64748b;">Tax (${invoice.taxRate}%)</td>
                        <td style="font-size:14px;color:#334155;font-weight:500;text-align:right;">${currency} ${invoice.taxAmount.toFixed(2)}</td>
                      </tr>` : ''}
                      <tr style="border-top:2px solid #6366f1;">
                        <td style="font-size:18px;font-weight:700;color:#0f172a;padding-top:12px;">Total Due</td>
                        <td style="font-size:18px;font-weight:700;color:#6366f1;text-align:right;padding-top:12px;">${currency} ${invoice.total.toFixed(2)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding:32px 40px;" align="center">
              <a href="${invoiceUrl}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#4f46e5);color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;padding:14px 40px;border-radius:10px;box-shadow:0 4px 14px rgba(99,102,241,0.4);">
                View &amp; Pay Invoice →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background:#f8fafc;border-top:1px solid #f1f5f9;text-align:center;">
              <p style="font-size:13px;color:#94a3b8;margin:0;">${settings?.invoiceFooter || `Thank you for your business, ${invoice.client.name}!`}</p>
              <p style="font-size:12px;color:#cbd5e1;margin:8px 0 0;">Sent by ${businessName} via InvoicePay</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─────────────────────────────────────────────
// Send Invoice Email
// ─────────────────────────────────────────────

export async function sendInvoiceEmail(
  invoice: InvoiceWithRelations,
  settings: Settings | null
): Promise<void> {
  if (!process.env.SMTP_USER) {
    console.warn('[email] SMTP_USER not set — skipping email dispatch');
    return;
  }

  const businessName = settings?.businessName || 'InvoicePay';
  const currency = settings?.currency || 'USD';

  try {
    await transporter.sendMail({
      from: `"${businessName}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: invoice.client.email,
      subject: `Invoice ${invoice.number} from ${businessName} — ${currency} ${invoice.total.toFixed(2)} due ${new Date(invoice.dueDate).toLocaleDateString()}`,
      html: buildInvoiceEmailHTML(invoice, settings),
    });
    console.log(`[email] Invoice ${invoice.number} sent to ${invoice.client.email}`);
  } catch (err) {
    console.error('[email] Failed to send invoice email:', err);
    // Do not throw — email failure should not block invoice creation
  }
}
