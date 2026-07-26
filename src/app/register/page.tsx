"use client";

import { useActionState } from "react";
import { registerUser } from "@/app/actions/auth";
import Link from "next/link";
import {
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  TrendingUp,
  Clock,
  Users,
} from "lucide-react";
import { useState } from "react";
import { SubmitButton } from "@/components/SubmitButton";

const initialState = { message: null };

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#EF4444", "#F59E0B", "#1469F8", "#10B981"];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{
              background: i <= score ? colors[score] : "#E5E7EB",
            }}
          />
        ))}
      </div>
      <p className="text-xs" style={{ color: colors[score] }}>
        {labels[score]}
      </p>
    </div>
  );
}

export default function RegisterPage() {
  const [state, formAction] = useActionState(registerUser, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex" style={{ fontFamily: '"Inter", sans-serif' }}>
      {/* ── Left Panel ─────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[55%] flex-col relative overflow-hidden"
        style={{ background: "#0A0A0A" }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Blue glow */}
        <div
          className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(20,105,248,0.12) 0%, transparent 70%)",
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

        {/* Copy */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-12 pb-12">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-6"
            style={{ color: "#1469F8" }}
          >
            Start for free
          </p>
          <h1
            className="text-5xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: '"Syne", sans-serif', letterSpacing: "-0.03em" }}
          >
            Join Fintra.
          </h1>
          <p
            className="text-base leading-relaxed mb-12"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Invoice clients, track payments, and understand your cash flow — in one clean workspace.
          </p>

          {/* Benefit bullets */}
          <div className="space-y-4">
            {[
              { icon: TrendingUp, label: "Revenue analytics updated in real time" },
              { icon: Clock,      label: "Automated reminders, zero manual chasing" },
              { icon: Users,      label: "Multi-client management out of the box" },
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

        {/* Stats strip */}
        <div
          className="relative z-10 mx-10 mb-10 grid grid-cols-3 gap-px rounded-xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {[
            { val: "$2.4M+", label: "Invoiced monthly" },
            { val: "4,200+", label: "Active businesses" },
            { val: "99.98%", label: "Platform uptime" },
          ].map(({ val, label }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center py-4"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <p
                className="text-lg font-bold text-white"
                style={{ fontFamily: '"Syne", sans-serif' }}
              >
                {val}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                {label}
              </p>
            </div>
          ))}
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
            style={{
              fontFamily: '"Syne", sans-serif',
              color: "#0A0A0A",
              letterSpacing: "-0.02em",
            }}
          >
            Create your account
          </h2>
          <p className="text-sm mb-8" style={{ color: "#6B7280" }}>
            Already have one?{" "}
            <Link
              href="/login"
              className="font-medium"
              style={{ color: "#1469F8" }}
            >
              Sign in
            </Link>
          </p>

          {state?.message && !state.success && (
            <div
              className="mb-6 flex items-center gap-3 p-3.5 rounded-xl"
              style={{
                background: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600">{state.message}</p>
            </div>
          )}

          <form action={formAction} className="space-y-4">
            {/* Full name */}
            <div>
              <label
                htmlFor="reg-name"
                className="block text-xs font-semibold mb-1.5"
                style={{ color: "#374151", letterSpacing: "0.01em" }}
              >
                Full name
              </label>
              <input
                id="reg-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Sarah Jenkins"
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
              {state?.errors?.name && (
                <p className="mt-1 text-xs text-red-500">{state.errors.name[0]}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="reg-email"
                className="block text-xs font-semibold mb-1.5"
                style={{ color: "#374151", letterSpacing: "0.01em" }}
              >
                Work email
              </label>
              <input
                id="reg-email"
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
              {state?.errors?.email && (
                <p className="mt-1 text-xs text-red-500">{state.errors.email[0]}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="reg-password"
                className="block text-xs font-semibold mb-1.5"
                style={{ color: "#374151", letterSpacing: "0.01em" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-lg text-sm transition-all"
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
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "#9CA3AF" }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <PasswordStrength password={password} />
              {state?.errors?.password && (
                <p className="mt-1 text-xs text-red-500">
                  {state.errors.password[0]}
                </p>
              )}
            </div>

            <SubmitButton
              pendingLabel="Creating account…"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white transition-all mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "#0A0A0A",
                boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
              }}
            >
              Create account
            </SubmitButton>
          </form>

          <p className="mt-8 text-xs text-center" style={{ color: "#9CA3AF" }}>
            By creating an account you agree to our{" "}
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
