"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, AlertCircle, CheckCircle, ShieldCheck, Zap, Globe } from "lucide-react";
import { useState, Suspense } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const justRegistered = searchParams.get("registered") === "1";

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: '"Inter", sans-serif' }}>
      {/* ── Left Panel ─────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[55%] flex-col relative overflow-hidden"
        style={{ background: "#0A0A0A" }}
      >
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Blue accent bleed — top right */}
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(20,105,248,0.15) 0%, transparent 70%)",
          }}
        />

        {/* Logo */}
        <div className="relative z-10 p-10">
          <div className="flex items-center gap-2.5">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center"
              style={{ background: "#1469F8" }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path d="M4 6h16M4 6v12M4 6l4-2h12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 12h8" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M14 14l4 4M14 18l4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span
              className="text-base font-bold tracking-tight text-white"
              style={{ fontFamily: '"Syne", sans-serif', letterSpacing: "-0.01em" }}
            >
              Fintra
            </span>
          </div>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-12 pb-12">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-6"
            style={{ color: "#1469F8" }}
          >
            Financial Operations
          </p>
          <h1
            className="text-5xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: '"Syne", sans-serif', letterSpacing: "-0.03em" }}
          >
            Welcome<br />back.
          </h1>
          <p className="text-base leading-relaxed mb-12" style={{ color: "rgba(255,255,255,0.45)" }}>
            Your invoicing dashboard, reports, and client data are right where you left them.
          </p>

          {/* Trust points */}
          <div className="space-y-4">
            {[
              { icon: ShieldCheck, label: "Bank-grade encryption on all data" },
              { icon: Zap,         label: "Sub-second invoice delivery" },
              { icon: Globe,       label: "99.98% uptime SLA" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div
                  className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(20,105,248,0.15)" }}
                >
                  <Icon size={15} style={{ color: "#1469F8" }} />
                </div>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice preview card */}
        <div className="relative z-10 mx-10 mb-10">
          <div
            className="rounded-xl p-5"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Invoice · INV-2024-0291
                </p>
                <p className="text-sm font-semibold text-white mt-0.5">
                  Northforge Industries
                </p>
              </div>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(20,105,248,0.2)",
                  color: "#3884FF",
                }}
              >
                Paid
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p
                className="text-2xl font-bold text-white"
                style={{ fontFamily: '"IBM Plex Mono", monospace' }}
              >
                $14,200.00
              </p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                May 16, 2026
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel ────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 bg-white">
        {/* Mobile logo */}
        <div className="flex items-center gap-2.5 mb-10 lg:hidden">
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center"
            style={{ background: "#0A0A0A" }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M4 6h16M4 6v12M4 6l4-2h12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 12h8" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span
            className="text-base font-bold tracking-tight"
            style={{ fontFamily: '"Syne", sans-serif', color: "#0A0A0A" }}
          >
            Fintra
          </span>
        </div>

        <div className="w-full max-w-sm">
          <h2
            className="text-2xl font-bold mb-1"
            style={{ fontFamily: '"Syne", sans-serif', color: "#0A0A0A", letterSpacing: "-0.02em" }}
          >
            Sign in
          </h2>
          <p className="text-sm mb-8" style={{ color: "#6B7280" }}>
            No account?{" "}
            <Link
              href="/register"
              className="font-medium transition-colors"
              style={{ color: "#1469F8" }}
            >
              Create one free
            </Link>
          </p>

          {justRegistered && (
            <div
              className="mb-6 flex items-center gap-3 p-3.5 rounded-xl"
              style={{
                background: "rgba(20,105,248,0.06)",
                border: "1px solid rgba(20,105,248,0.2)",
              }}
            >
              <CheckCircle size={16} style={{ color: "#1469F8", flexShrink: 0 }} />
              <p className="text-sm font-medium" style={{ color: "#1469F8" }}>
                Account created. Sign in below.
              </p>
            </div>
          )}

          {error && (
            <div
              className="mb-6 flex items-center gap-3 p-3.5 rounded-xl"
              style={{
                background: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold mb-1.5"
                style={{ color: "#374151", letterSpacing: "0.01em" }}
              >
                Email address
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@company.com"
                className="w-full px-3.5 py-2.5 rounded-lg text-sm transition-all"
                style={{
                  border: "1px solid #E5E7EB",
                  color: "#0A0A0A",
                  background: "#fff",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#1469F8";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(20,105,248,0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#E5E7EB";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold"
                  style={{ color: "#374151", letterSpacing: "0.01em" }}
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-medium transition-colors"
                  style={{ color: "#6B7280" }}
                >
                  Forgot?
                </a>
              </div>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg text-sm transition-all"
                style={{
                  border: "1px solid #E5E7EB",
                  color: "#0A0A0A",
                  background: "#fff",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#1469F8";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(20,105,248,0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#E5E7EB";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            <button
              type="submit"
              id="login-submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white transition-all mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "#0A0A0A",
                boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
              }}
              onMouseEnter={(e) => {
                if (!isPending)
                  (e.currentTarget as HTMLElement).style.background = "#1F1F23";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#0A0A0A";
              }}
            >
              {isPending && <Loader2 size={15} className="animate-spin" />}
              {isPending ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-8 text-xs text-center" style={{ color: "#9CA3AF" }}>
            By signing in you agree to our{" "}
            <a href="#" className="underline underline-offset-2" style={{ color: "#6B7280" }}>
              Terms
            </a>{" "}
            &{" "}
            <a href="#" className="underline underline-offset-2" style={{ color: "#6B7280" }}>
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: "#0A0A0A" }}
        >
          <Loader2 size={24} className="animate-spin" style={{ color: "#1469F8" }} />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
