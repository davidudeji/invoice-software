# Component Library - Complete Guide

Built with the InvoicePay design system featuring **Slate Navy primary**, **Emerald accent**, and **Warm Paper surface**.

## Quick Start

Import components from the barrel export:

```tsx
import {
  Button,
  Card,
  Badge,
  Input,
  DataTable,
  InvoiceHeader,
} from "@/components";
```

---

## Core Components

### Button

Primary call-to-action element supporting four variants.

**Props:**

- `variant`: "primary" | "accent" | "secondary" | "ghost" (default: "primary")
- `size`: "sm" | "md" | "lg" (default: "md")
- `isLoading`: boolean - Shows loading spinner
- `disabled`: boolean
- `children`: ReactNode

**Usage:**

```tsx
<Button>Save Invoice</Button>
<Button variant="accent" size="lg">Create</Button>
<Button variant="secondary" disabled>Cancelled</Button>
<Button isLoading>Processing...</Button>
```

**Variants:**

- **primary** (Slate Navy bg, white text) - Main actions
- **accent** (Emerald bg, white text) - Affirmative actions
- **secondary** (Slate-100 bg, dark text) - Secondary actions
- **ghost** (Transparent, slate text) - Tertiary/inline actions

---

### Card

Container component for organizing content with consistent spacing and styling.

**Components:**

- `Card` - Main wrapper
- `CardHeader` - Title + subtitle + action
- `CardBody` - Main content
- `CardFooter` - Actions/metadata

**Props:**

- `Card`: `elevated` (boolean), `className`
- `CardHeader`: `title`, `subtitle`, `action`, `children`, `className`
- `CardBody`: `children`, `className`
- `CardFooter`: `children`, `className`

**Usage:**

```tsx
<Card>
  <CardHeader title="Invoice Details" />
  <CardBody>
    <p>Invoice content goes here</p>
  </CardBody>
  <CardFooter>
    <Button>Save</Button>
  </CardFooter>
</Card>

<Card elevated>
  <CardHeader
    title="Important"
    action={<Badge status="paid">Paid</Badge>}
  />
</Card>
```

---

### Badge

Status indicator for invoices, payments, and system states.

**Props:**

- `status`: "draft" | "sent" | "paid" | "overdue" | "partial" | "cancelled"
- `children`: ReactNode

**Usage:**

```tsx
<Badge status="paid">Paid</Badge>
<Badge status="overdue">5 Days Overdue</Badge>
<Badge status="partial">Partial Payment</Badge>
```

**Styling:**

- **paid**: Emerald background, emerald text
- **overdue**: Rose background, rose text
- **partial**: Amber background, amber text
- **draft**: Slate background, slate text
- **sent**: Slate background, slate text
- **cancelled**: Slate background, slate text

---

### Form Elements

#### Input

Text input field with integrated label, error handling, and icons.

**Props:**

- `label`: string
- `error`: string
- `hint`: string
- `icon`: ReactNode
- `iconPosition`: "left" | "right"
- `required`: boolean
- Standard input attributes

**Usage:**

```tsx
<Input
  label="Invoice Amount"
  type="number"
  placeholder="0.00"
  error={errors.amount}
  required
/>

<Input
  label="Search"
  icon={<Search size={18} />}
  iconPosition="left"
  placeholder="Find invoice..."
/>
```

#### TextArea

Multi-line input field.

**Usage:**

```tsx
<TextArea
  label="Description"
  placeholder="Add invoice details..."
  error={errors.description}
/>
```

#### Select

Dropdown selection field.

**Props:**

- `label`: string
- `options`: Array<{ value: string; label: string }>
- `error`: string
- `hint`: string
- `required`: boolean

**Usage:**

```tsx
<Select
  label="Status"
  options={[
    { value: "draft", label: "Draft" },
    { value: "sent", label: "Sent" },
    { value: "paid", label: "Paid" },
  ]}
/>
```

#### FormGroup

Wrapper combining label + input with consistent spacing and error display.

**Props:**

- `label`: string
- `required`: boolean
- `error`: string
- `hint`: string
- `children`: ReactNode

**Usage:**

```tsx
<FormGroup label="Client Name" required error={errors.clientName}>
  <Input placeholder="Enter client name" />
</FormGroup>
```

---

### DataTable

Reusable table component for displaying structured data with sorting support.

**Props:**

- `columns`: Column[]
- `data`: T[]
- `rowKey`: keyof T
- `onRowClick`: (item: T) => void
- `isLoading`: boolean
- `emptyMessage`: string
- `compact`: boolean

**Column Definition:**

```tsx
interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, item: T) => ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}
```

**Usage:**

```tsx
<DataTable
  columns={[
    { key: "id", label: "Invoice #" },
    {
      key: "amount",
      label: "Amount",
      align: "right",
      render: (value) => `$${value.toLocaleString()}`,
    },
    {
      key: "status",
      label: "Status",
      render: (value) => <Badge status={value}>{value}</Badge>,
    },
  ]}
  data={invoices}
  rowKey="id"
  onRowClick={(invoice) => navigate(`/invoices/${invoice.id}`)}
/>
```

---

### InvoiceHeader (Signature Component)

Showcase component displaying invoice details with currency formatting and payment progress.

**Props:**

- `invoiceNumber`: string
- `clientName`: string
- `dueDate`: string
- `status`: BadgeStatus
- `amount`: number
- `amountPaid`: number (optional)
- `currency`: string (default: "USD")

**Usage:**

```tsx
<InvoiceHeader
  invoiceNumber="INV-2024-001"
  clientName="Acme Corporation"
  dueDate="July 30, 2026"
  status="sent"
  amount={5250}
  amountPaid={1250}
/>
```

**Features:**

- Displays total amount in large mono font
- Shows payment progress bar for partial payments
- Calculates remaining balance automatically
- Uses Emerald accent for paid amounts

---

### Alert

Notification component for info, success, warning, and error messages.

**Props:**

- `type`: "info" | "success" | "warning" | "error"
- `title`: string
- `message`: string (required)
- `onClose`: () => void
- `action`: { label: string; onClick: () => void }
- `className`: string

**Usage:**

```tsx
<Alert
  type="success"
  title="Invoice Created"
  message="Invoice #INV-2024-001 has been created successfully."
  action={{ label: "View", onClick: handleView }}
  onClose={() => setShowAlert(false)}
/>
```

---

### Loading States

#### LoadingSpinner

Full-screen or inline loading indicator.

**Props:**

- `size`: "sm" | "md" | "lg"
- `message`: string
- `fullScreen`: boolean

**Usage:**

```tsx
<LoadingSpinner message="Processing payment..." />
<LoadingSpinner fullScreen size="lg" />
```

#### Skeleton

Placeholder for content while loading.

**Usage:**

```tsx
<Skeleton className="h-12 w-full mb-4" />
<SkeletonLine />
<SkeletonCard />
```

#### EmptyState

Container for empty data states with optional action.

**Props:**

- `icon`: ReactNode
- `title`: string
- `description`: string
- `action`: { label: string; onClick: () => void; variant?: string }

**Usage:**

```tsx
<EmptyState
  icon={<FileText size={48} className="text-slate-300" />}
  title="No Invoices Yet"
  description="Create your first invoice to get started."
  action={{ label: "Create Invoice", onClick: handleCreate }}
/>
```

---

### Pagination

Navigation component for multi-page data.

**Props:**

- `currentPage`: number
- `totalPages`: number
- `onPageChange`: (page: number) => void
- `showPageNumbers`: boolean
- `maxVisiblePages`: number

**Usage:**

```tsx
<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
  showPageNumbers
  maxVisiblePages={5}
/>
```

---

### Dialog (Modal)

Modal dialog for focused user interactions.

**Props:**

- `isOpen`: boolean
- `onClose`: () => void
- `title`: string
- `description`: string
- `children`: ReactNode
- `footer`: ReactNode
- `size`: "sm" | "md" | "lg" | "xl"
- `showCloseButton`: boolean

**Usage:**

```tsx
<Dialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Create Invoice"
  size="lg"
  footer={
    <>
      <Button variant="secondary" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="accent" onClick={handleSubmit}>
        Create
      </Button>
    </>
  }
>
  <InvoiceForm />
</Dialog>;

{
  /* Confirm Dialog */
}
<ConfirmDialog
  isOpen={showConfirm}
  title="Delete Invoice?"
  message="This action cannot be undone."
  confirmText="Delete"
  isDestructive
  onConfirm={handleDelete}
  onCancel={() => setShowConfirm(false)}
/>;
```

---

### Dropdown

Dropdown menu for actions and selections.

**Props:**

- `trigger`: ReactNode
- `items`: DropdownItem[]
- `align`: "left" | "right"

**Item Definition:**

```tsx
interface DropdownItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "danger";
}
```

**Usage:**

```tsx
<Dropdown
  trigger={<Button variant="ghost">Options</Button>}
  items={[
    { label: "Edit", onClick: handleEdit },
    { label: "Duplicate", onClick: handleDuplicate },
    { label: "Delete", onClick: handleDelete, variant: "danger" },
  ]}
  align="right"
/>;

{
  /* Simple Dropdown */
}
<SimpleDropdown label="Actions" items={items} />;

{
  /* Select Menu */
}
<SelectMenu
  options={[
    { value: "draft", label: "Draft" },
    { value: "sent", label: "Sent" },
  ]}
  value={status}
  onChange={setStatus}
  placeholder="Select status..."
/>;
```

---

### StatCard

Dashboard metric card with icon, trend indicator, and customizable colors.

**Props:**

- `label`: string
- `value`: string
- `icon`: LucideIcon
- `trend`: string
- `trendUp`: boolean
- `color`: "primary" | "accent" | "amber" | "rose"

**Usage:**

```tsx
<StatCard
  label="Total Revenue"
  value="$45,231"
  icon={DollarSign}
  trend="12%"
  trendUp={true}
  color="accent"
/>
```

---

## Typography Classes

The design system uses custom typography classes:

- `font-display` - Lora serif font for headings (authority)
- `font-body` - Inter sans-serif for body text (precision)
- `font-mono` - IBM Plex Mono for data/amounts (distinction)

**Type Scale:**
| Class | Size | Usage |
|-------|------|-------|
| `text-5xl` | 3.0rem | Page hero |
| `text-4xl` | 2.25rem | Section heading |
| `text-3xl` | 1.875rem | Subsection |
| `text-2xl` | 1.5rem | Card title |
| `text-lg` | 1.125rem | Form section |
| `text-base` | 1rem | Body text |
| `text-sm` | 0.875rem | Secondary text |
| `text-xs` | 0.75rem | Captions/badges |

---

## Color Utilities

Access design tokens directly in components:

```tsx
// CSS Variables
--color-primary: 31 41 55           /* Slate Navy */
--color-accent: 16 185 129          /* Emerald */
--color-surface: 250 250 248        /* Warm Paper */

// Tailwind Color Classes
bg-slate-900, text-emerald-600, border-slate-200
```

---

## Component Showcase

View all components in action:

📍 **Route:** `/components-showcase`

This page demonstrates every component with interactive examples and documentation.

---

## Best Practices

1. **Consistency**: Always use the component library instead of custom styles
2. **Accessibility**: All components include proper ARIA labels and keyboard navigation
3. **Motion**: Respect `prefers-reduced-motion` for animations
4. **Focus States**: All interactive elements have visible focus rings (Emerald outline)
5. **Error Handling**: Use `error` prop on form elements for validation feedback
6. **Loading States**: Use `LoadingSpinner` or `isLoading` prop for async actions
7. **Responsive**: Components are mobile-first and fully responsive

---

## File Structure

```
src/components/
├── Button.tsx
├── Card.tsx
├── Badge.tsx
├── Input.tsx
├── FormGroup.tsx
├── DataTable.tsx
├── InvoiceHeader.tsx
├── Alert.tsx
├── Loading.tsx (EmptyState, LoadingSpinner, Skeleton)
├── Pagination.tsx
├── Dialog.tsx (Dialog, ConfirmDialog)
├── Dropdown.tsx (Dropdown, SimpleDropdown, SelectMenu)
├── index.ts (Barrel export)
├── Dashboard/
│   ├── StatCard.tsx
│   ├── DashboardHeader.tsx
│   └── ...
```

---

## Integration Example

Complete form with validation and submission:

```tsx
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Input,
  TextArea,
  FormGroup,
  Select,
  Alert,
} from "@/components";

export function InvoiceForm() {
  const [data, setData] = useState({
    client: "",
    amount: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // API call
      const response = await fetch("/api/invoices", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage("Invoice created successfully");
        setData({ client: "", amount: "", description: "" });
      }
    } catch (error) {
      setMessage("Failed to create invoice");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {message && (
        <Alert
          type={message.includes("success") ? "success" : "error"}
          message={message}
          onClose={() => setMessage("")}
        />
      )}

      <Card>
        <CardHeader title="Create Invoice" />
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormGroup label="Client" required>
              <Input
                placeholder="Client name"
                value={data.client}
                onChange={(e) => setData({ ...data, client: e.target.value })}
                error={errors.client}
              />
            </FormGroup>

            <FormGroup label="Amount" required>
              <Input
                type="number"
                placeholder="0.00"
                value={data.amount}
                onChange={(e) => setData({ ...data, amount: e.target.value })}
                error={errors.amount}
              />
            </FormGroup>

            <FormGroup label="Description">
              <TextArea
                placeholder="Invoice details..."
                value={data.description}
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
              />
            </FormGroup>
          </form>
        </CardBody>
        <CardFooter>
          <Button variant="secondary">Cancel</Button>
          <Button variant="accent" isLoading={isLoading} onClick={handleSubmit}>
            Create Invoice
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
```

---

**Last Updated:** 2026-07-08  
**Design System:** InvoicePay v1.0  
**Built with:** React 19 + TypeScript + Tailwind CSS
