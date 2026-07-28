# Fintra — Invoice, Collect, Grow

**Fintra** is a professional invoicing and financial management platform for modern businesses. Send invoices, track payments, manage clients and inventory, and understand your cash flow — all in one workspace.

---

## Features

- 📄 **Invoice Management** — Create, send, and track invoices with real-time payment status
- 👥 **Client Management** — Maintain a full client database with history and contact info
- 📦 **Inventory & Categories** — Track products/services and organise them by category
- 💰 **Sales & Reports** — Visualise revenue, overdue balances, and cash flow trends
- ✅ **Approvals & Audit** — Built-in approval workflows and a full audit trail
- 🔔 **Email Notifications** — Automatic invoice delivery and payment reminders via Nodemailer
- 💳 **Stripe Payments** — Integrated online payment collection
- 🤖 **AI Document Scanning** — Extract invoice data from images using Google Gemini + Tesseract.js
- 🔐 **Auth** — Secure authentication with NextAuth v5 (credentials + session management)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Neon (Serverless Postgres) |
| ORM | Prisma |
| Auth | NextAuth v5 |
| Payments | Stripe |
| Storage | AWS S3 |
| AI | Google Gemini, Tesseract.js |
| Charts | Recharts |
| Animations | GSAP |
| State | Zustand |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) database
- A [Stripe](https://stripe.com) account
- An [AWS S3](https://aws.amazon.com/s3/) bucket
- A Google Gemini API key

### 1. Clone & Install

```bash
git clone <repo-url>
cd invoice-software
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Key variables to set:

```env
# Database
DATABASE_URL=

# Auth
AUTH_SECRET=
NEXTAUTH_URL=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# AWS S3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET_NAME=

# Google Gemini
GOOGLE_GEMINI_API_KEY=
```

### 3. Run Migrations

```bash
npx prisma migrate deploy
```

### 4. Start Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
src/
├── app/                  # Next.js App Router pages & API routes
│   ├── dashboard/        # Main dashboard
│   ├── invoices/         # Invoice list & detail
│   ├── invoice/          # Single invoice view (public)
│   ├── clients/          # Client management
│   ├── inventory/        # Product/service inventory
│   ├── categories/       # Category management
│   ├── sales/            # Sales tracking
│   ├── reports/          # Financial reports
│   ├── approvals/        # Approval workflows
│   ├── audit/            # Audit log
│   ├── settings/         # Account & app settings
│   ├── login/            # Authentication
│   └── register/         # User registration
├── components/           # Reusable UI component library
├── controllers/          # Business logic controllers
├── services/             # External service integrations
├── repositories/         # Data access layer
├── lib/                  # Utilities, stores, configs
├── validators/           # Zod validation schemas
└── types/                # Shared TypeScript types
```

---

## Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

---

## Deployment

This app is configured for deployment on [Vercel](https://vercel.com).

1. Push to GitHub
2. Import the repository on Vercel
3. Add all environment variables in the Vercel dashboard
4. Deploy — Vercel will run `prisma generate && next build` automatically

---

## License

Private — All rights reserved.
