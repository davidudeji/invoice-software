"use client";

import { Button } from "@/components/Button";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { Input, TextArea, Select } from "@/components/Input";
import { FormGroup } from "@/components/FormGroup";
import { Alert } from "@/components/Alert";
import { StatCard } from "@/components/Dashboard/StatCard";
import { InvoiceHeader } from "@/components/InvoiceHeader";
import { DataTable } from "@/components/DataTable";
import { DollarSign, TrendingUp, Users, FileText } from "lucide-react";
import { useState } from "react";

export default function ComponentShowcase() {
  const [alert, setAlert] = useState(true);

  // Sample data for table
  const sampleInvoices = [
    {
      id: "INV-001",
      client: "Acme Corp",
      amount: 2500,
      status: "paid" as const,
      dueDate: "2026-07-15",
    },
    {
      id: "INV-002",
      client: "Tech Solutions",
      amount: 1800,
      status: "sent" as const,
      dueDate: "2026-07-20",
    },
    {
      id: "INV-003",
      client: "Global Industries",
      amount: 3200,
      status: "overdue" as const,
      dueDate: "2026-06-30",
    },
    {
      id: "INV-004",
      client: "Creative Agency",
      amount: 1500,
      status: "partial" as const,
      dueDate: "2026-07-25",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div>
          <h1 className="font-display text-5xl font-semibold text-slate-900 mb-2">
            Design System Showcase
          </h1>
          <p className="text-lg text-slate-600">
            All components built with the new design tokens
          </p>
        </div>

        {/* Alerts */}
        <section className="space-y-4">
          <h2 className="font-display text-3xl font-semibold text-slate-900">
            Alerts
          </h2>
          {alert && (
            <Alert
              type="success"
              title="Invoice Created"
              message="Invoice #INV-2024-001 has been successfully created."
              action={{ label: "View", onClick: () => {} }}
              onClose={() => setAlert(false)}
            />
          )}
          <Alert
            type="warning"
            title="Payment Overdue"
            message="Invoice INV-2024-003 is now 5 days overdue. Consider sending a reminder."
          />
          <Alert
            type="error"
            title="Connection Error"
            message="Failed to sync data. Please check your connection and try again."
          />
        </section>

        {/* Buttons */}
        <section className="space-y-4">
          <h2 className="font-display text-3xl font-semibold text-slate-900">
            Buttons
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="accent">Accent</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
          </div>
        </section>

        {/* Badges */}
        <section className="space-y-4">
          <h2 className="font-display text-3xl font-semibold text-slate-900">
            Badges
          </h2>
          <div className="flex flex-wrap gap-3">
            <Badge status="draft">Draft</Badge>
            <Badge status="sent">Sent</Badge>
            <Badge status="paid">Paid</Badge>
            <Badge status="overdue">Overdue</Badge>
            <Badge status="partial">Partial Payment</Badge>
            <Badge status="cancelled">Cancelled</Badge>
          </div>
        </section>

        {/* Stat Cards */}
        <section className="space-y-4">
          <h2 className="font-display text-3xl font-semibold text-slate-900">
            Stat Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              label="Total Revenue"
              value="$45,231"
              trend="12%"
              trendUp={true}
              icon={DollarSign}
              color="accent"
            />
            <StatCard
              label="Invoices Sent"
              value="24"
              trend="3%"
              trendUp={true}
              icon={FileText}
              color="primary"
            />
            <StatCard
              label="Active Clients"
              value="18"
              trend="2%"
              trendUp={false}
              icon={Users}
              color="amber"
            />
            <StatCard
              label="Overdue Invoices"
              value="3"
              trend="1"
              trendUp={false}
              icon={TrendingUp}
              color="rose"
            />
          </div>
        </section>

        {/* Invoice Header */}
        <section className="space-y-4">
          <h2 className="font-display text-3xl font-semibold text-slate-900">
            Invoice Header (Signature Element)
          </h2>
          <InvoiceHeader
            invoiceNumber="INV-2024-001"
            clientName="Acme Corporation"
            dueDate="July 30, 2026"
            status="sent"
            amount={5250}
            amountPaid={0}
          />
        </section>

        {/* Forms */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl font-semibold text-slate-900">
            Form Elements
          </h2>
          <Card>
            <CardBody className="space-y-6">
              <FormGroup
                label="Invoice Number"
                hint="Auto-generated if left blank"
              >
                <Input placeholder="INV-2024-..." />
              </FormGroup>

              <FormGroup label="Client Name" required>
                <Input placeholder="Enter client name" />
              </FormGroup>

              <FormGroup
                label="Invoice Amount"
                required
                error="Please enter a valid amount"
              >
                <Input type="number" placeholder="0.00" />
              </FormGroup>

              <FormGroup label="Description">
                <TextArea placeholder="Add invoice details..." />
              </FormGroup>

              <FormGroup label="Payment Status">
                <Select
                  options={[
                    { value: "draft", label: "Draft" },
                    { value: "sent", label: "Sent" },
                    { value: "paid", label: "Paid" },
                    { value: "overdue", label: "Overdue" },
                  ]}
                />
              </FormGroup>

              <div className="flex gap-3 pt-4">
                <Button variant="primary">Save Invoice</Button>
                <Button variant="secondary">Cancel</Button>
              </div>
            </CardBody>
          </Card>
        </section>

        {/* Data Table */}
        <section className="space-y-4">
          <h2 className="font-display text-3xl font-semibold text-slate-900">
            Data Table
          </h2>
          <Card>
            <CardBody className="p-0">
              <DataTable
                columns={[
                  { key: "id", label: "Invoice" },
                  { key: "client", label: "Client" },
                  {
                    key: "amount",
                    label: "Amount",
                    align: "right",
                    render: (value) => `$${value.toLocaleString()}`,
                  },
                  {
                    key: "status",
                    label: "Status",
                    render: (value) => (
                      <Badge status={value}>
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                      </Badge>
                    ),
                  },
                  { key: "dueDate", label: "Due Date" },
                ]}
                data={sampleInvoices}
                rowKey="id"
                onRowClick={(invoice) => console.log("Clicked:", invoice)}
              />
            </CardBody>
          </Card>
        </section>

        {/* Cards */}
        <section className="space-y-4">
          <h2 className="font-display text-3xl font-semibold text-slate-900">
            Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader
                title="Standard Card"
                subtitle="This is a normal card"
              />
              <CardBody>
                <p className="text-slate-600">
                  Cards are the foundation for organizing content. They provide
                  a clean, contained space for related information.
                </p>
              </CardBody>
              <CardFooter>
                <Button variant="secondary" size="sm">
                  Learn More
                </Button>
              </CardFooter>
            </Card>

            <Card elevated>
              <CardHeader
                title="Elevated Card"
                subtitle="With more shadow for emphasis"
              />
              <CardBody>
                <p className="text-slate-600">
                  Use elevated cards to draw attention to important content or
                  primary actions.
                </p>
              </CardBody>
              <CardFooter>
                <Button variant="primary" size="sm">
                  Take Action
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl font-semibold text-slate-900">
            Typography
          </h2>
          <Card>
            <CardBody className="space-y-6">
              <div>
                <h1>Heading 1 (Lora Display Font)</h1>
                <p className="text-xs text-slate-500 mt-1">
                  font-display text-5xl
                </p>
              </div>
              <div>
                <h2>Heading 2 (Lora Display Font)</h2>
                <p className="text-xs text-slate-500 mt-1">
                  font-display text-4xl
                </p>
              </div>
              <div>
                <h3>Heading 3 (Lora Display Font)</h3>
                <p className="text-xs text-slate-500 mt-1">
                  font-display text-3xl
                </p>
              </div>
              <div>
                <p className="text-base">
                  Body text (Inter Font) - This is regular paragraph text used
                  throughout the application for descriptions, labels, and
                  interface copy.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  font-body text-base
                </p>
              </div>
              <div>
                <p className="font-mono text-sm">
                  Monospace text (IBM Plex Mono) - Used for data, amounts, and
                  codes
                </p>
                <p className="text-xs text-slate-500 mt-1">font-mono text-sm</p>
              </div>
            </CardBody>
          </Card>
        </section>
      </div>
    </div>
  );
}
