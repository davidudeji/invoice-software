# InvoicePay — Architecture & Engineering Guide

> **Audience**: Beginner → Intermediate → Expert progression.  
> Every decision, error, and fix is explained in full.

---

## 1. What This App Does

**InvoicePay** is a SaaS invoice & sales management platform. Here is everything it handles:

| Feature | Description |
|---|---|
| **Auth** | Email + password login via NextAuth v5 |
| **Invoices** | Create, send, track, and update invoices through a full lifecycle |
| **Clients** | Manage client contacts and billing history |
| **Inventory** | Product catalog with stock tracking |
| **Categories** | Group products with color-coded badges |
| **Sales Ledger** | Auto-created when an invoice is marked PAID |
| **Payments** | Stripe-powered checkout for online payment collection |
| **Email** | Nodemailer invoice delivery with an HTML email template |
| **AI Reports** | Gemini AI executive summaries over financial data |
| **OCR** | Tesseract.js — scan receipts/invoices from images |
| **File Storage** | Cloudflare R2 for logos and documents |
| **Audit Log** | Immutable log of every create/update/delete action |
| **Settings** | Per-user business profile, tax rates, payment methods |

---

## 2. Tech Stack — Why Each Technology Was Chosen

```
Next.js 16 (App Router)   ← Full-stack React framework
Prisma 7 + Neon           ← Type-safe ORM + serverless Postgres
NextAuth v5               ← Authentication (sessions + JWT)
Tailwind CSS              ← Utility-first styling
Stripe                    ← Payment processing
Nodemailer                ← SMTP email delivery
Google Gemini AI          ← AI business summaries
Tesseract.js              ← Browser/server OCR
Cloudflare R2             ← S3-compatible object storage
Zustand                   ← Lightweight React state management
Recharts                  ← Chart components for reports
Zod                       ← Runtime schema validation
Vercel                    ← Edge/serverless deployment platform
```

### Why Next.js App Router (not Pages Router)?

The App Router gives you **React Server Components (RSC)** — components that run only on the server, never ship JavaScript to the browser, and can directly call databases. This eliminated a whole API layer: instead of `fetch("/api/clients")`, a page can `await prisma.client.findMany()` directly.

---

## 3. Project Structure

```
invoice-software/
├── prisma/
│   ├── schema.prisma          ← Database schema (source of truth)
│   └── migrations/            ← SQL migration history
├── prisma.config.ts           ← Prisma 7 config file (datasource URL lives here)
├── src/
│   ├── app/                   ← Next.js App Router pages + API routes
│   │   ├── layout.tsx         ← Root layout (wraps all pages with SessionProvider)
│   │   ├── page.tsx           ← Landing page
│   │   ├── dashboard/         ← Dashboard with stats + charts
│   │   ├── invoices/          ← Invoice list, new invoice, invoice detail
│   │   ├── clients/           ← Client list, new client, client detail
│   │   ├── inventory/         ← Product catalog, new product, edit product
│   │   ├── categories/        ← Category management
│   │   ├── sales/             ← Sales ledger
│   │   ├── reports/           ← AI-powered analytics
│   │   ├── audit/             ← Immutable audit log
│   │   ├── settings/          ← Business profile + preferences
│   │   ├── login/             ← Auth pages
│   │   ├── register/          ← Registration
│   │   ├── store/             ← Public Stripe payment pages
│   │   ├── invoice/[id]/      ← Public invoice view
│   │   ├── approvals/         ← Approval workflow
│   │   └── api/
│   │       ├── auth/          ← NextAuth handler
│   │       ├── ocr/           ← Tesseract OCR endpoint
│   │       ├── stripe/
│   │       │   ├── checkout/  ← Create Stripe Checkout session
│   │       │   ├── webhook/   ← Stripe webhook (marks invoices PAID)
│   │       │   └── public-checkout/ ← Public payment link
│   │       └── ai/            ← AI sub-router
│   ├── actions/               ← Next.js Server Actions (database mutations)
│   │   ├── auth.ts            ← registerUser
│   │   ├── invoices.ts        ← CRUD + email send
│   │   ├── clients.ts         ← CRUD
│   │   ├── products.ts        ← CRUD + stock management
│   │   ├── categories.ts      ← CRUD
│   │   ├── reports.ts         ← getReportData, generateAISummary
│   │   ├── settings.ts        ← Business profile, tax rates, payment methods
│   │   └── upload.ts          ← R2 presigned URL generation
│   ├── components/            ← React UI components
│   │   ├── Layout/            ← AppSidebar (persistent navigation)
│   │   ├── Dashboard/         ← Charts, widgets
│   │   ├── Invoices/          ← Builder form, list, detail, OCR scanner
│   │   ├── Inventory/         ← Product grid with filters
│   │   ├── Sales/             ← Sales table
│   │   ├── Reports/           ← Charts + AI summary
│   │   ├── Settings/          ← Forms for all settings sections
│   │   ├── Categories/        ← Color picker, badge UI
│   │   ├── Landing/           ← Marketing landing page
│   │   ├── Providers.tsx      ← NextAuth SessionProvider wrapper
│   │   └── SubmitButton.tsx   ← Form submit button with pending state
│   ├── lib/
│   │   ├── prisma.ts          ← Prisma client singleton (Neon adapter)
│   │   ├── ai.ts              ← Gemini AI client
│   │   ├── email.ts           ← Nodemailer transporter + HTML template
│   │   ├── r2.ts              ← Cloudflare R2 (S3-compatible) client
│   │   ├── audit.ts           ← writeAuditLog helper
│   │   ├── store.ts           ← Zustand client-side stores
│   │   └── utils.ts           ← Shared utilities
│   ├── types/
│   │   └── index.ts           ← Re-exports Prisma types + custom interfaces
│   ├── auth.ts                ← NextAuth config (credentials provider + bcrypt)
│   ├── auth.config.ts         ← Auth callbacks (JWT, session, authorized)
│   └── middleware.ts          ← Route protection (Edge runtime)
├── vercel.json                ← Vercel function timeout config
├── next.config.ts             ← Next.js config (serverExternalPackages)
├── prisma.config.ts           ← Prisma 7 datasource config
└── .env                       ← Environment variables (never commit!)
```

---

## 4. Data Flow — How It All Connects

### Example: Creating an Invoice

```
User fills form (InvoiceBuilderForm.tsx — Client Component)
  │
  ▼ calls Server Action
createInvoice() in src/app/actions/invoices.ts
  │
  ├─ Validates payload with Zod schema
  ├─ Calls prisma.$transaction() — creates Invoice + InvoiceItems atomically
  ├─ Deducts stock from Product.stockQuantity for linked products
  ├─ Optionally calls sendInvoiceEmail() via Nodemailer
  ├─ Writes to AuditLog via writeAuditLog()
  ├─ Calls revalidatePath('/invoices') — clears Next.js cache
  └─ Calls redirect('/invoices/[newId]') — navigates to new invoice
```

### Why Server Actions (not API routes)?

Server Actions let client components call server-side functions **as if they were local functions**, without any HTTP boilerplate. The data is sent over POST automatically, Next.js handles CSRF protection, and you get TypeScript types end-to-end.

---

## 5. Database Design

### Why Prisma + Neon?

- **Prisma** gives you a type-safe query builder. If your database has a `User` table, you get `prisma.user.findMany()` with full TypeScript autocomplete. No raw SQL mistakes.
- **Neon** is serverless Postgres — it scales to zero and uses HTTP connections instead of persistent TCP connections, making it perfect for Vercel's serverless functions.

### The `@prisma/adapter-neon` Pattern

```typescript
// src/lib/prisma.ts
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })
```

Traditional Postgres uses a long-lived TCP connection. Vercel serverless functions spin up and down per-request, so they can't keep TCP connections alive. The Neon adapter uses HTTP instead — each query is an HTTP request. This trades slight per-query latency for stateless serverless compatibility.

### Key Schema Decisions

```
User → 1:1 → Settings         (each user has one business profile)
User → 1:N → Client           (each user owns their own clients)
User → 1:N → Product          (each user owns their own inventory)
User → 1:N → Invoice          (each user owns their own invoices)
Invoice → 1:N → InvoiceItem   (line items)
Invoice → 1:N → Payment       (multiple payments per invoice — partial pay)
Invoice → 0:1 → Sale          (auto-created when status = PAID)
```

The `Sale` model is intentionally simple — it's an immutable record created when an invoice reaches PAID status. This makes sales reporting clean: just sum `Sale.totalAmount`.

---

## 6. Authentication Architecture

### NextAuth v5 — Split Config Pattern

```
middleware.ts         ← Edge runtime — fastest possible auth check
  └─ imports auth.config.ts (no Prisma — Edge-compatible)

src/auth.ts           ← Full Node.js runtime — full auth handler
  └─ imports Prisma and bcrypt (NOT Edge-compatible)
```

**Why split into two files?**

Next.js `middleware.ts` runs on the **Edge Runtime** — a lightweight V8 environment with no Node.js APIs. Prisma and bcrypt use Node.js APIs, so they can't run in middleware. The solution:

1. `auth.config.ts` — contains only Edge-compatible logic (route protection callbacks)
2. `middleware.ts` — imports only `auth.config.ts`
3. `auth.ts` — the full NextAuth setup with Prisma + bcrypt, used only in server components

### Password Security

```typescript
// Registration — bcrypt with 12 rounds
const hashedPassword = await bcrypt.hash(password, 12);
// 12 rounds ≈ 250ms on modern hardware — slow enough to resist brute force

// Login
const passwordsMatch = await bcrypt.compare(password, user.password);
```

Never store plain text passwords. `bcrypt.hash` is a one-way function with a cost factor. Even if your database is breached, attackers cannot reverse the hashes.

---

## 7. Stripe Payment Flow

```
1. User clicks "Collect Payment" on invoice
2. POST /api/stripe/checkout
   └─ Creates Stripe Checkout Session with invoice line items
   └─ Sets metadata: { invoiceId, userId }
   └─ Returns { url: "https://checkout.stripe.com/..." }
3. Frontend redirects user to Stripe's hosted checkout page
4. Client pays with card
5. Stripe sends POST to /api/stripe/webhook
   └─ Verifies webhook signature (tamper detection!)
   └─ Runs prisma.$transaction():
      ├─ Updates Invoice.status = PAID
      ├─ Creates Payment record
      ├─ Creates Sale record (for revenue reporting)
      └─ Deducts product stock
   └─ Writes audit log entry
6. Client is redirected to the success_url
```

**Why verify the webhook signature?** Without verification, anyone could POST to your webhook endpoint and fake a payment. The Stripe signature proves the event genuinely came from Stripe.

---

## 8. AI Report Architecture

```
User clicks "AI Summary" in Reports page
  │
  ▼ Client Component calls Server Action
generateAISummary(dateFrom, dateTo) → src/app/actions/reports.ts
  │
  ├─ getReportData() — 5 parallel Postgres queries:
  │   ├─ prisma.sale.aggregate       (total revenue)
  │   ├─ prisma.invoice.aggregate    (outstanding debt)
  │   ├─ prisma.invoice.count        (overdue count)
  │   ├─ prisma.invoiceItem.findMany (top products by revenue)
  │   └─ prisma.sale.findMany        (revenue grouped by week)
  │
  └─ generateBusinessSummary(data) → src/lib/ai.ts
      ├─ Builds structured prompt with financial data
      ├─ Calls Gemini 1.5 Flash (fast + cheap model)
      └─ Returns plain-text executive summary (250-400 words)
```

---

## 9. OCR Receipt Scanning

The `/api/ocr` route uses **Tesseract.js** to extract text from invoice/receipt images:

```typescript
export const runtime = "nodejs"; // MUST be declared — Tesseract requires Node.js APIs

const worker = await createWorker("eng");
const { data } = await worker.recognize(buffer);
await worker.terminate();
```

Regex patterns then parse the raw text to extract vendor name, line items, total amount, and due date.

**Why is `runtime = "nodejs"` critical?** By default, Next.js 16 API routes use the Edge Runtime. Tesseract.js downloads language files to disk (`fs`) and loads WASM — both require Node.js APIs. Forgetting this annotation causes a cryptic module bundling error at build time.

---

## 10. Errors Encountered & How They Were Fixed

This section documents every real error hit during this build and deployment process.

---

### ❌ Error 1 — Prisma 7 Breaking Change: `url` in schema.prisma

**Full error output:**
```
Error: Prisma schema validation - (get-config wasm)
Error code: P1012
error: The datasource property `url` is no longer supported in schema files.
Move connection URLs for Migrate to `prisma.config.ts`
  --> prisma\schema.prisma:3
   |
 2 |   provider = "postgresql"
 3 |   url      = env("DATABASE_URL")
   |
```

**Root cause:**

Prisma 7 is a major version that moved datasource URL out of `schema.prisma` into a separate `prisma.config.ts` file.

```prisma
// ❌ BROKEN in Prisma 7
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")   // removed in v7
}
```

**Fix:**
```prisma
//  Correct for Prisma 7
datasource db {
  provider = "postgresql"
  // URL is now in prisma.config.ts
}
```

```typescript
// prisma.config.ts — this is where the URL goes now
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

**Lesson:** Always read the migration guide when bumping a major version. Prisma 7's biggest breaking change was externalising the datasource configuration.

---

### ❌ Error 2 — Deprecated `driverAdapters` Preview Feature

**Warning:**
```
warn Preview feature "driverAdapters" is deprecated. 
The functionality can be used without specifying it as a preview feature.
```

**Root cause:** In Prisma <7, using a driver adapter (like `PrismaNeon`) required opting in with `previewFeatures = ["driverAdapters"]`. In Prisma 7 this became stable.

```prisma
// ❌ Deprecated warning in Prisma 7
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]   // no longer needed
}
```

**Fix:**
```prisma
// ✅ Clean for Prisma 7
generator client {
  provider = "prisma-client-js"
}
```

---

### ❌ Error 3 — TypeScript Build Failure: Stale Dev Route Types

**Full error:**
```
.next/dev/types/routes.d.ts:56:15
Type error: ';' expected.

  54 |   }
  55 | }
> 56 | /inventory/new": {}
     |               ^
  57 |   "/invoice/[id]": { "id": string; }
```

**Root cause:**

`tsconfig.json` was including `.next/dev/types/**/*.ts` in TypeScript compilation:

```json
"include": [
  ".next/types/**/*.ts",
  ".next/dev/types/**/*.ts",   // ← PROBLEM
  "**/*.ts",
  "**/*.tsx"
]
```

During `next dev`, Next.js generates route type files in `.next/dev/types/`. If the dev server is killed mid-regeneration, the file is left corrupt — in this case the opening double-quote of a string key was missing:

```
/inventory/new": {}      ← should be "/inventory/new": {}
```

When `next build` then ran TypeScript checking, it read this broken file and failed. **Vercel's build environment is always clean** (no `.next` directory exists), so this only breaks local builds for developers who ran `next dev` first.

**Fix — two changes:**

1. Remove `.next/dev/types` from `tsconfig.json`:
```json
"include": [
  ".next/types/**/*.ts",    // keep — build-time types
  "**/*.ts",
  "**/*.tsx"
]
```

2. Delete the stale cache before rebuilding:
```powershell
# Windows
Remove-Item -Recurse -Force .next

# Mac/Linux
rm -rf .next
```

**Lesson:** The `.next/` directory is a build artifact and build cache. It is in `.gitignore` for a reason. Never commit it. If TypeScript errors seem nonsensical ("missing semicolons" in auto-generated files), suspect a stale `.next` cache first.

---

### ❌ Error 4 — Environment Variable Name Mismatches (Silent Failures)

**Problem:** No build error. The app runs fine. But email never sends, logo uploads silently fail, and AI features might not work.

The code was reading different env var names than what the `.env` file actually defined:

| Code reads | `.env` had | Effect |
|---|---|---|
| `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` | `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS` | All emails silently dropped |
| `CLOUDFLARE_R2_ACCESS_KEY_ID` | `R2_ACCESS_KEY_ID` | Logo uploads silently fail |
| `AUTH_SECRET` (next-auth v5 standard) | `NEXTAUTH_SECRET` | Auth may not work on Vercel |

**This is one of the hardest categories of bug to find** because there is no error — the app just silently skips the feature. For example:

```typescript
// src/lib/email.ts
if (!process.env.SMTP_USER) {
  console.warn('[email] SMTP_USER not set — skipping');
  return; // ← silently exits, no error thrown
}
```

**Fix — standardise across all files:**
- `src/lib/email.ts` — updated to use `SMTP_*` names
- `.env` — updated to match what code actually reads
- `.env.example` — updated as the canonical reference document

**Lesson:** Your `.env.example` file is a **contract**. Every environment variable the application reads must appear in it, using the exact name the code expects. Treat it with the same care as a type definition.

---

### ❌ Error 5 — Tesseract.js Timeout on Vercel (Configuration Issue)

**Problem:** OCR works locally but always fails on Vercel with a timeout error.

**Root cause:** Vercel's default function timeout is **10 seconds**. Tesseract OCR processing (loading language models + running character recognition) typically takes 15-45 seconds on a real image.

**Fix — `vercel.json`:**
```json
{
  "functions": {
    "src/app/api/ocr/route.ts": {
      "maxDuration": 60
    },
    "src/app/api/ai/**": {
      "maxDuration": 30
    },
    "src/app/api/stripe/webhook/route.ts": {
      "maxDuration": 30
    }
  }
}
```

**Lesson:** Always think about execution time for heavy operations (AI calls, OCR, PDF generation). Default timeouts kill long-running serverless functions. Configure `vercel.json` to give them enough runway.

---

## 11. Vercel Deployment Configuration

### `next.config.ts` — Why `serverExternalPackages` Matters

```typescript
serverExternalPackages: [
  "@prisma/client",
  "@prisma/adapter-neon",
  "@neondatabase/serverless",
  "nodemailer",
  "tesseract.js",
  "bcryptjs",
]
```

Next.js's build process tries to bundle all server-side dependencies into a single JavaScript file. This fails for packages that:

- Contain **native binaries** (Prisma client has compiled C++ for each OS/architecture)
- Load **WASM files at runtime** (Tesseract downloads `.wasm` files)
- Use **dynamic `require()`** patterns (nodemailer, bcryptjs)

`serverExternalPackages` tells Next.js: "don't bundle these — let Node.js require them at runtime from `node_modules`."

### Auth Callback URL on Vercel

```typescript
// src/app/api/stripe/checkout/route.ts
success_url: `${process.env.NEXTAUTH_URL}/invoices/${invoice.id}?payment=success`,
cancel_url:  `${process.env.NEXTAUTH_URL}/invoices/${invoice.id}?payment=cancelled`,
```

`NEXTAUTH_URL` must be set to your actual Vercel deployment URL, e.g. `https://invoicepay.vercel.app`. Without it, Stripe redirects back to `undefined/invoices/...` which 404s.

---

## 12. How the Auth Middleware Works

```typescript
// middleware.ts — runs on EVERY request before any page loads
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
```

The matcher regex excludes:
- `/api/*` — API routes handle their own auth
- `/_next/static/*` — static assets (JS, CSS files)
- `/_next/image/*` — image optimisation
- `*.png` — public images

For everything else, the `authorized` callback in `auth.config.ts` runs:

```typescript
authorized({ auth, request: { nextUrl } }) {
  const isLoggedIn = !!auth?.user;
  const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
  
  if (isOnDashboard) {
    if (isLoggedIn) return true;   // allow
    return false;                   // redirect to /login
  } else if (isLoggedIn) {
    // Logged-in user visiting /login or / → redirect to dashboard
    if (nextUrl.pathname === '/login' || nextUrl.pathname === '/') {
      return Response.redirect(new URL('/dashboard', nextUrl));
    }
  }
  return true; // allow all other public routes
}
```

---

## 13. Security Best Practices Applied

| Practice | Where Applied |
|---|---|
| **Password hashing** | bcrypt with 12 rounds in `registerUser()` |
| **Auth guard on every server action** | Every action starts with `const session = await auth()` |
| **Row-level data isolation** | Every query scoped to `where: { userId }` — users can't see each other's data |
| **Zod validation** | Every server action validates inputs before touching the database |
| **Webhook signature verification** | Stripe webhooks verified with `stripe.webhooks.constructEvent()` |
| **Env vars never committed** | `.env*` in `.gitignore`; secrets only in Vercel dashboard |
| **SQL injection impossible** | Prisma uses parameterised queries — no raw SQL string interpolation |
| **CSRF protection** | Server Actions include automatic CSRF protection by Next.js |

---

## 14. Performance Decisions

| Decision | Reason |
|---|---|
| `export const revalidate = 60` on dashboard | Cache the page for 60s, reducing database queries under load |
| `export const revalidate = 30` on clients list | Shorter cache since client data changes more frequently |
| `useTransition` for mutations | Keeps UI responsive (non-blocking) during server round-trips |
| `Promise.all([...])` for parallel queries | Fetch multiple datasets simultaneously instead of sequentially |
| `serverExternalPackages` in next.config | Prevents Prisma/Tesseract from being incorrectly bundled |
| Zustand for invoice builder | Form state too complex for React state — Zustand avoids prop drilling |

---

## 15. Manual Deployment Checklist

### Step 1: Database Setup (Neon)

1. Create account at [neon.tech](https://neon.tech)
2. Create new project → copy the **Connection String** (it looks like `postgresql://user:pass@host/db?sslmode=require`)
3. From your local terminal, run the migration to create all database tables:
   ```bash
   npx prisma migrate deploy
   ```
   > This only needs to be done once, or after any schema changes.

### Step 2: Vercel Environment Variables

Go to **Vercel Dashboard → Your Project → Settings → Environment Variables** and add:

| Variable | Required | Where to Get |
|---|---|---|
| `DATABASE_URL` | ✅ | Neon dashboard → Connection string |
| `AUTH_SECRET` | ✅ | Run `openssl rand -base64 32` locally |
| `NEXTAUTH_URL` | ✅ | Your Vercel URL: `https://yourapp.vercel.app` |
| `GOOGLE_GENERATIVE_AI_API_KEY` | For AI Reports | [Google AI Studio](https://aistudio.google.com) → Get API key |
| `STRIPE_SECRET_KEY` | For payments | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| `STRIPE_WEBHOOK_SECRET` | For webhooks | Created in Step 3 below |
| `SMTP_HOST` | For email | Your SMTP provider (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | For email | `587` (TLS) or `465` (SSL) |
| `SMTP_USER` | For email | Your SMTP username / email address |
| `SMTP_PASS` | For email | Your SMTP password or app password |
| `SMTP_FROM` | For email | e.g. `invoices@yourdomain.com` |
| `CLOUDFLARE_R2_ACCESS_KEY_ID` | For logo uploads | Cloudflare dashboard → R2 → Manage API tokens |
| `CLOUDFLARE_R2_SECRET_ACCESS_KEY` | For logo uploads | Same as above |
| `CLOUDFLARE_R2_BUCKET_NAME` | For logo uploads | Name of your R2 bucket |
| `CLOUDFLARE_R2_ENDPOINT` | For logo uploads | `https://<account_id>.r2.cloudflarestorage.com` |
| `NEXT_PUBLIC_R2_PUBLIC_URL` | For logo display | Your R2 public bucket URL |

### Step 3: Stripe Webhook Setup

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. URL: `https://yourapp.vercel.app/api/stripe/webhook`
4. Select event: `checkout.session.completed`
5. Click **Add endpoint** → copy the **Signing Secret**
6. Add the signing secret as `STRIPE_WEBHOOK_SECRET` in Vercel

### Step 4: Deploy

Once GitHub is connected to Vercel (done automatically when you import the repo):
```bash
git add .
git commit -m "production ready"
git push origin main
```
Vercel automatically triggers a deployment on every push to `main`.

---

## 16. Mental Model — Request to Response

```
Browser: GET /invoices
         │
         ▼ ~1ms
middleware.ts (Edge Runtime)
  └─ Check auth token → valid → pass through
         │
         ▼
src/app/invoices/page.tsx (Server Component, Node.js runtime)
  └─ await auth()          → get userId from session token
  └─ await getInvoices()   → Server Action → Prisma → Neon HTTP → Postgres
  └─ await prisma.client   → parallel query → results
  └─ return JSX
         │
         ▼
React renders HTML on server → streams to browser
         │
         ▼
InvoiceListClient.tsx (Client Component — hydrated in browser)
  └─ useState, useTransition, event handlers become interactive
```

The key insight: **pages are server components by default** (zero JS shipped to browser). Only when you add interactivity (filters, forms, modals) do you add `"use client"` to opt into browser JavaScript. This is why Next.js App Router apps are fast — most of the work happens on the server.
