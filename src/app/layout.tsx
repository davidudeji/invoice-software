import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: {
    template: "%s | Fintra",
    default: "Fintra — Invoice, Collect, Grow",
  },
  description:
    "Professional invoicing, payment tracking, and financial reporting for modern businesses. Send invoices, collect payments, and understand your cash flow in one workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased" style={{ background: "#F9FAFB" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
