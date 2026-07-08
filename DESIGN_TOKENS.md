# InvoicePay Design Tokens

## Design Philosophy

This invoice software balances authority, precision, and approachability. The visual system reinforces trustworthiness for business-critical transactions while maintaining clarity at all interaction points.

---

## Color Palette

### Primary Brand: Slate Navy

- **#1F2937** (`--color-primary`) - Main interface elements, text, primary buttons
- **#17242F** (`--color-primary-dark`) - Hover states, darker contexts
- **#374151** (`--color-primary-light`) - Subtle backgrounds, secondary actions
- **Use Case:** Invoices, headers, primary navigation, form labels

### Accent: Emerald

- **#10B981** (`--color-accent`) - Call-to-action, success states, positive flows
- **#059669** (`--color-accent-dark`) - Hover/active states
- **#4ADE80** (`--color-accent-light`) - Highlights, data visualization
- **Use Case:** "Create Invoice," "Mark Paid," confirmation states, upward trends

### Surface: Warm Paper & Soft Slate

- **#FAFAF8** (`--color-surface`) - Main page background, invoice printing surface
- **#F3F4F6** (`--color-surface-muted`) - Table headers, secondary backgrounds
- **#E5E7EB** (`--color-border`) - Borders, dividers, subtle structure
- **Use Case:** Page backgrounds, cards, section dividers

### Semantic: Status & States

- **Rose (#F43F5E):** Overdue, errors, warnings
- **Amber (#F59E0B):** Partial payments, pending actions
- **Slate (#64748B):** Drafts, cancelled, neutral states

---

## Typography

### Display Font: Lora (Serif)

- **Usage:** Page headers (H1–H4), large numbers (invoice totals, metrics)
- **Weight:** 500–700
- **Purpose:** Creates authority, signals important figures
- **Line height:** 1.2–1.4

### Body Font: Inter (Sans-serif)

- **Usage:** All interface text, form labels, descriptions, body copy
- **Weight:** 400–600
- **Size range:** 0.75rem (xs) to 2.25rem (2xl)
- **Purpose:** Precision, readability on screens, modern feel

### Data Font: IBM Plex Mono (Monospace)

- **Usage:** Invoice numbers, amounts, dates, transaction IDs, code blocks
- **Weight:** 400–500
- **Purpose:** Distinguishes data from narrative, supports scanning
- **Line height:** 1.5

### Type Scale

| Size | Rem   | Use Case                 |
| ---- | ----- | ------------------------ |
| 5xl  | 3.0   | Page hero title          |
| 4xl  | 2.25  | Section heading          |
| 3xl  | 1.875 | Subsection heading       |
| 2xl  | 1.5   | Card title, large label  |
| xl   | 1.25  | Subheading               |
| lg   | 1.125 | Form section title       |
| base | 1     | Body text, table content |
| sm   | 0.875 | Secondary text, captions |
| xs   | 0.75  | Badges, micro-copy       |

---

## Component Tokens

### Buttons

```css
.btn-primary       /* Slate Navy, white text: primary actions */
.btn-accent        /* Emerald, white text: affirmative actions */
.btn-secondary     /* Slate 100, dark text: secondary actions */
.btn-ghost         /* Transparent, slate text: tertiary/inline actions */
```

**Padding:** 0.625rem vertical × 1rem horizontal  
**Border radius:** 0.5rem  
**Font weight:** 600  
**Focus:** 2px emerald outline offset 2px

### Inputs & Forms

```css
.input             /* Slate border, warm paper background */
```

**Border:** 1px slate-200  
**Focus state:** Emerald-500 border with shadow  
**Disabled:** Slate-50 background, reduced opacity  
**Placeholder:** Slate-400 text

### Badges

| Class            | Background | Text Color  |
| ---------------- | ---------- | ----------- |
| `.badge-draft`   | Slate-100  | Slate-700   |
| `.badge-sent`    | Slate-100  | Slate-600   |
| `.badge-paid`    | Emerald-50 | Emerald-700 |
| `.badge-overdue` | Rose-50    | Rose-700    |
| `.badge-partial` | Amber-50   | Amber-700   |

**Padding:** 0.75rem horizontal × 0.25rem vertical  
**Border radius:** Full  
**Font size:** 0.75rem  
**Font weight:** 600

### Cards

```css
.card              /* White bg, slate-200 border, shadow-sm */
.card-elevated     /* White bg, slate-200 border, shadow-md */
```

**Border radius:** 0.5rem  
**Border:** 1px slate-200  
**Padding:** 1.5rem  
**Use for:** Dashboard stats, invoice details, forms

### Tables

- **Header:** Soft Slate background, slate-500 text
- **Rows:** White bg, hover on slate-50
- **Dividers:** Slate-100 borders
- **Font:** Inter (body), IBM Plex Mono (amounts/codes)

---

## Spacing Scale

Uses Tailwind's standard scale:

- **xs:** 0.25rem (1px dividers, micro-gaps)
- **sm:** 0.5rem (form gaps, icon spacing)
- **md:** 1rem (section padding, card interiors)
- **lg:** 1.5rem (main content padding)
- **xl:** 2rem (page sections)
- **2xl:** 3rem (major section breaks)

---

## Interaction States

### Focus Ring

- **Color:** Emerald-500 at 50% opacity
- **Width:** 2px offset
- **Applies to:** All interactive elements (inputs, buttons, links)

### Hover States

- **Buttons:** 10% darker shade of button color
- **Links:** Emerald-600 (primary) or slate-700 (secondary)
- **Rows:** Subtle slate-50 background

### Active/Selected

- **Background:** Emerald-100
- **Text:** Emerald-700
- **Border:** Emerald-300

---

## Accessibility

- **Color contrast:** All text meets WCAG AAA (7:1 minimum)
- **Motion:** Respects `prefers-reduced-motion`
- **Focus:** Always visible, keyboard-navigable
- **Typography:** Semantic HTML (H1, H2, etc.) with correct hierarchy

---

## CSS Custom Properties (CSS Variables)

Access design tokens directly in CSS:

```css
--font-display:
  "Lora", serif --font-body: "Inter", sans-serif --font-mono: "IBM Plex Mono",
  monospace --color-primary: 31 41 55 /* Slate Navy RGB */ --color-accent: 16
    185 129 /* Emerald RGB */ --color-surface: 250 250 248 /* Warm Paper RGB */
    --color-surface-muted: 243 244 246 /* Soft Slate RGB */ --color-text: 31 41
    55 /* Slate-800 RGB */ --color-text-muted: 107 114 128 /* Slate-500 RGB */;
```

**Usage in CSS:**

```css
.my-element {
  background: rgb(var(--color-surface));
  color: rgb(var(--color-text));
  border: 1px solid rgb(var(--color-border));
}
```

---

## Design Signature: Precision Micro-Interactions

When users interact with financial elements (amounts, invoice numbers, status changes), the interface responds with:

- **Gentle slide-in animations** on numeric data (50-100ms)
- **Focus highlighting** that draws attention to critical fields
- **Confirmation moments** before irreversible actions (visual pause, then confirmation)
- **Smooth state transitions** (200-300ms) for visual coherence

This embodies the subject: invoicing requires attention to detail, and the interface responds with precision.

---

## Usage Examples

### Creating an Invoice Success Card

```jsx
<div className="card bg-emerald-50 border-emerald-200">
  <h3 className="font-display text-2xl text-slate-900">Invoice Created</h3>
  <p className="text-sm text-slate-600 mt-2">
    Invoice #2024-001 is ready to send.
  </p>
  <button className="btn btn-accent mt-4">Send Invoice</button>
</div>
```

### Form with Focus Ring

```jsx
<input type="text" className="input" placeholder="Invoice number" />
```

### Status Badge

```jsx
<span className="badge badge-paid">Paid</span>
```

### Data Table

```jsx
<table className="data-table">
  <thead>
    <tr>
      <th>Invoice</th>
      <th>Amount</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="font-mono">#INV-2024-001</td>
      <td className="font-mono text-right">$1,250.00</td>
      <td>
        <span className="badge badge-paid">Paid</span>
      </td>
    </tr>
  </tbody>
</table>
```

---

**Last Updated:** 2026-07-08  
**Defined by:** Frontend Design System  
**Next Review:** After first component library build-out
