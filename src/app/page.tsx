"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Clock,
  CreditCard,
  CheckCircle2,
  FileText,
  ChevronRight,
  TrendingUp,
  Zap,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const FINTRA_BLUE = "#1469F8";
const FINTRA_INK = "#0A0A0A";

/* ─── Fintra Logo SVG ─────────────────────────── */
function FintraLogo({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-7 w-7 rounded-lg flex items-center justify-center"
        style={{ background: dark ? "#fff" : FINTRA_INK }}
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <path
            d="M4 6h16M4 6v12M4 6l4-2h12"
            stroke={dark ? FINTRA_INK : "#fff"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 12h8"
            stroke={dark ? FINTRA_INK : "#fff"}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M14 14l4 4M14 18l4-4"
            stroke={FINTRA_BLUE}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span
        className="text-sm font-bold"
        style={{
          fontFamily: '"Syne", sans-serif',
          color: dark ? "#fff" : FINTRA_INK,
          letterSpacing: "-0.01em",
        }}
      >
        Fintra
      </span>
    </div>
  );
}

export default function LandingPage() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".hero-el", {
        y: 32,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      });

      gsap.from(".hero-visual", {
        y: 48,
        opacity: 0,
        duration: 1.1,
        delay: 0.4,
        ease: "power3.out",
      });

      gsap.utils.toArray<HTMLElement>(".fade-up").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
          y: 28,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
        });
      });
    },
    { scope: container }
  );

  return (
    <div
      ref={container}
      className="min-h-screen overflow-x-hidden selection:bg-blue-100"
      style={{
        background: "#F9FAFB",
        fontFamily: '"Inter", -apple-system, sans-serif',
        color: FINTRA_INK,
      }}
    >
      {/* ── Navigation ────────────────────────────────────────── */}
      <nav
        className="fixed w-full z-50 transition-all"
        style={{
          background: "rgba(249,250,251,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(229,231,235,0.8)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <FintraLogo />

          <div
            className="hidden md:flex items-center gap-8 text-sm font-medium"
            style={{ color: "#6B7280" }}
          >
            <a
              href="#features"
              className="transition-colors hover:text-black"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="transition-colors hover:text-black"
            >
              How it works
            </a>
            <a
              href="#pricing"
              className="transition-colors hover:text-black"
            >
              Pricing
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden md:block text-sm font-medium transition-colors"
              style={{ color: "#6B7280" }}
            >
              Log in
            </Link>
            <Link
              href="/register"
              id="nav-start-free"
              className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all"
              style={{
                background: FINTRA_INK,
                boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
              }}
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left copy */}
          <div>
            <p
              className="hero-el text-xs font-semibold uppercase tracking-widest mb-6"
              style={{ color: FINTRA_BLUE }}
            >
              Invoicing for modern businesses
            </p>
            <h1
              className="hero-el text-5xl md:text-6xl font-bold leading-none mb-6"
              style={{
                fontFamily: '"Syne", sans-serif',
                color: FINTRA_INK,
                letterSpacing: "-0.035em",
              }}
            >
              Invoices that<br />
              work while<br />
              you{" "}
              <span style={{ color: FINTRA_BLUE }}>sleep.</span>
            </h1>
            <p
              className="hero-el text-lg leading-relaxed mb-10"
              style={{ color: "#6B7280", maxWidth: "420px" }}
            >
              Send professional invoices, collect payments, and track your cash flow — from one focused workspace built for accuracy.
            </p>

            <div className="hero-el flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                id="hero-start-free"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-xl transition-all"
                style={{
                  background: FINTRA_INK,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                }}
              >
                Start for free <ArrowRight size={16} />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-xl transition-all"
                style={{
                  color: "#374151",
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                }}
              >
                See how it works
              </a>
            </div>

            <div
              className="hero-el flex items-center gap-5 mt-8 text-xs font-medium"
              style={{ color: "#9CA3AF" }}
            >
              {["No credit card", "Cancel anytime", "Free forever on Starter"].map(
                (item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} style={{ color: "#10B981" }} />
                    {item}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Right: visual */}
          <div className="hero-visual relative">
            {/* Offset background shape */}
            <div
              className="absolute -top-6 -right-6 w-full h-full rounded-3xl"
              style={{ background: "rgba(20,105,248,0.06)", transform: "rotate(2deg)" }}
            />

            {/* Main dashboard card */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: "#fff",
                border: "1px solid #E5E7EB",
                boxShadow: "0 20px 60px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.06)",
              }}
            >
              {/* Window chrome */}
              <div
                className="flex items-center gap-2 px-5 py-3.5"
                style={{ borderBottom: "1px solid #F1F5F9", background: "#FAFAFA" }}
              >
                <div className="flex gap-1.5">
                  {["#FF5F57", "#FFBD2E", "#28C840"].map((c) => (
                    <div
                      key={c}
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: c }}
                    />
                  ))}
                </div>
                <div
                  className="flex-1 h-5 rounded-md mx-4"
                  style={{ background: "#E5E7EB" }}
                />
              </div>

              {/* Dashboard body */}
              <div className="p-5">
                {/* Header row */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p
                      className="text-xs font-medium"
                      style={{ color: "#9CA3AF" }}
                    >
                      Total Revenue
                    </p>
                    <p
                      className="text-2xl font-bold"
                      style={{
                        fontFamily: '"IBM Plex Mono", monospace',
                        color: FINTRA_INK,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      $24,680.00
                    </p>
                  </div>
                  <div
                    className="px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                    style={{ background: "rgba(16,185,129,0.1)", color: "#059669" }}
                  >
                    <TrendingUp size={11} /> +18.2%
                  </div>
                </div>

                {/* Sparkline */}
                <div className="flex items-end gap-1 h-14 mb-5">
                  {[35, 55, 42, 70, 58, 85, 65, 90, 72, 95].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm transition-all"
                      style={{
                        height: `${h}%`,
                        background:
                          i === 9
                            ? FINTRA_BLUE
                            : `rgba(20,105,248,${0.15 + i * 0.07})`,
                      }}
                    />
                  ))}
                </div>

                {/* Invoice rows */}
                <div className="space-y-2">
                  {[
                    { num: "INV-2024-0291", client: "Northforge Industries", amt: "$4,200.00", status: "Paid" },
                    { num: "INV-2024-0290", client: "Atlas & Stone",         amt: "$1,850.00", status: "Sent" },
                    { num: "INV-2024-0289", client: "HarborPeak Logistics",  amt: "$6,500.00", status: "Overdue" },
                  ].map((row) => {
                    const statusColor: React.CSSProperties =
                      row.status === "Paid"
                        ? { background: "rgba(20,105,248,0.1)", color: "#1469F8" }
                        : row.status === "Sent"
                        ? { background: "rgba(14,165,233,0.1)", color: "#0EA5E9" }
                        : { background: "rgba(239,68,68,0.1)", color: "#EF4444" };
                    return (
                      <div
                        key={row.num}
                        className="flex items-center justify-between rounded-lg px-3 py-2.5"
                        style={{ background: "#F8FAFC" }}
                      >
                        <div>
                          <p
                            className="text-xs font-semibold"
                            style={{
                              fontFamily: '"IBM Plex Mono", monospace',
                              color: FINTRA_INK,
                            }}
                          >
                            {row.num}
                          </p>
                          <p className="text-xs" style={{ color: "#9CA3AF" }}>
                            {row.client}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs font-semibold"
                            style={{
                              fontFamily: '"IBM Plex Mono", monospace',
                              color: FINTRA_INK,
                            }}
                          >
                            {row.amt}
                          </span>
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded-full"
                            style={statusColor}
                          >
                            {row.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Floating stat badge */}
            <div
              className="absolute -bottom-4 -left-8 rounded-xl px-4 py-3"
              style={{
                background: "#fff",
                border: "1px solid #E5E7EB",
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              }}
            >
              <p className="text-xs" style={{ color: "#9CA3AF" }}>
                Outstanding
              </p>
              <p
                className="text-base font-bold"
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  color: FINTRA_INK,
                }}
              >
                $6,840.00
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Narrative Flow ────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="py-20 px-6"
        style={{ background: "#fff", borderTop: "1px solid #E5E7EB" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="fade-up mb-14">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: FINTRA_BLUE }}
            >
              The workflow
            </p>
            <h2
              className="text-3xl font-bold"
              style={{
                fontFamily: '"Syne", sans-serif',
                color: FINTRA_INK,
                letterSpacing: "-0.025em",
              }}
            >
              Four steps. Zero friction.
            </h2>
          </div>

          {/* Asymmetric step layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Create",
                desc: "Build a precise invoice with your client details, line items, tax rates, and due date.",
                icon: FileText,
              },
              {
                step: "02",
                title: "Send",
                desc: "Deliver instantly via branded email. Your client receives a clean payment link.",
                icon: Zap,
              },
              {
                step: "03",
                title: "Collect",
                desc: "Clients pay securely via Stripe. Funds are tracked the moment they arrive.",
                icon: CreditCard,
              },
              {
                step: "04",
                title: "Analyse",
                desc: "Your dashboard updates in real time. Cash flow reports write themselves.",
                icon: BarChart3,
              },
            ].map((item, i) => {
              const Icon = item.icon;
              const isLast = i === 3;
              return (
                <div
                  key={item.step}
                  className="fade-up relative"
                  style={{ paddingTop: i % 2 === 1 ? "2rem" : "0" }}
                >
                  <div
                    className="rounded-2xl p-6 h-full flex flex-col"
                    style={{
                      background: isLast ? FINTRA_INK : "#F8FAFC",
                      border: isLast ? "none" : "1px solid #E5E7EB",
                    }}
                  >
                    <div className="flex items-start justify-between mb-8">
                      <span
                        className="text-xs font-bold"
                        style={{
                          fontFamily: '"IBM Plex Mono", monospace',
                          color: isLast ? "rgba(255,255,255,0.3)" : "#D1D5DB",
                        }}
                      >
                        {item.step}
                      </span>
                      <div
                        className="h-8 w-8 rounded-xl flex items-center justify-center"
                        style={{
                          background: isLast
                            ? "rgba(20,105,248,0.2)"
                            : "rgba(20,105,248,0.08)",
                        }}
                      >
                        <Icon
                          size={16}
                          style={{ color: isLast ? "#3884FF" : FINTRA_BLUE }}
                        />
                      </div>
                    </div>
                    <h3
                      className="text-lg font-bold mb-2"
                      style={{
                        fontFamily: '"Syne", sans-serif',
                        color: isLast ? "#fff" : FINTRA_INK,
                        letterSpacing: "-0.015em",
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color: isLast ? "rgba(255,255,255,0.5)" : "#6B7280",
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                  {/* Connector arrow */}
                  {i < 3 && (
                    <div
                      className="hidden md:flex absolute top-12 -right-3 z-10 items-center justify-center w-6 h-6 rounded-full"
                      style={{ background: "#E5E7EB" }}
                    >
                      <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Features Bento ───────────────────────────────────── */}
      <section
        id="features"
        className="py-20 px-6 max-w-7xl mx-auto"
      >
        <div className="fade-up mb-14">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: FINTRA_BLUE }}
          >
            Capabilities
          </p>
          <h2
            className="text-3xl font-bold max-w-xl"
            style={{
              fontFamily: '"Syne", sans-serif',
              color: FINTRA_INK,
              letterSpacing: "-0.025em",
            }}
          >
            Everything you need. Nothing you don't.
          </h2>
        </div>

        {/* Bento grid — asymmetric */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Large feature */}
          <div
            className="fade-up md:col-span-2 rounded-2xl p-8 flex flex-col justify-between"
            style={{
              background: FINTRA_INK,
              minHeight: "240px",
            }}
          >
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center mb-6"
              style={{ background: "rgba(20,105,248,0.2)" }}
            >
              <ShieldCheck size={20} style={{ color: "#3884FF" }} />
            </div>
            <div>
              <h3
                className="text-xl font-bold text-white mb-2"
                style={{ fontFamily: '"Syne", sans-serif', letterSpacing: "-0.015em" }}
              >
                Bank-grade security, always on.
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                AES-256 encryption, immutable audit logs, and Stripe-secured payments mean your client data and financial records are protected around the clock.
              </p>
            </div>
          </div>

          <div
            className="fade-up rounded-2xl p-7 flex flex-col"
            style={{ background: "#fff", border: "1px solid #E5E7EB" }}
          >
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center mb-6"
              style={{ background: "rgba(20,105,248,0.08)" }}
            >
              <BarChart3 size={20} style={{ color: FINTRA_BLUE }} />
            </div>
            <h3
              className="text-base font-bold mb-2"
              style={{ fontFamily: '"Syne", sans-serif', color: FINTRA_INK, letterSpacing: "-0.015em" }}
            >
              Real-time analytics
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
              Revenue trends, outstanding balances, and cash flow forecasts update the moment a payment lands.
            </p>
          </div>

          <div
            className="fade-up rounded-2xl p-7 flex flex-col"
            style={{ background: "#fff", border: "1px solid #E5E7EB" }}
          >
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center mb-6"
              style={{ background: "rgba(20,105,248,0.08)" }}
            >
              <Clock size={20} style={{ color: FINTRA_BLUE }} />
            </div>
            <h3
              className="text-base font-bold mb-2"
              style={{ fontFamily: '"Syne", sans-serif', color: FINTRA_INK, letterSpacing: "-0.015em" }}
            >
              Automated reminders
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
              Set up payment schedules once. Fintra handles follow-ups automatically so you never chase a client manually.
            </p>
          </div>

          <div
            className="fade-up rounded-2xl p-7 flex flex-col"
            style={{ background: "#fff", border: "1px solid #E5E7EB" }}
          >
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center mb-6"
              style={{ background: "rgba(20,105,248,0.08)" }}
            >
              <CreditCard size={20} style={{ color: FINTRA_BLUE }} />
            </div>
            <h3
              className="text-base font-bold mb-2"
              style={{ fontFamily: '"Syne", sans-serif', color: FINTRA_INK, letterSpacing: "-0.015em" }}
            >
              Global payment collection
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
              Accept payments from clients anywhere via Stripe. Multi-currency, instant confirmation, zero manual reconciliation.
            </p>
          </div>

          {/* Wide bottom feature */}
          <div
            className="fade-up md:col-span-3 rounded-2xl p-8"
            style={{
              background: "rgba(20,105,248,0.04)",
              border: "1px solid rgba(20,105,248,0.12)",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(20,105,248,0.12)" }}
                >
                  <Globe size={20} style={{ color: FINTRA_BLUE }} />
                </div>
                <div>
                  <h3
                    className="text-base font-bold"
                    style={{ fontFamily: '"Syne", sans-serif', color: FINTRA_INK, letterSpacing: "-0.015em" }}
                  >
                    API-first architecture
                  </h3>
                  <p className="text-sm" style={{ color: "#6B7280" }}>
                    Integrate billing flows directly into your stack. Robust REST API with webhooks and detailed documentation.
                  </p>
                </div>
              </div>
              <Link
                href="/register"
                className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all"
                style={{
                  background: FINTRA_BLUE,
                  color: "#fff",
                  boxShadow: "0 2px 8px rgba(20,105,248,0.3)",
                }}
              >
                Explore API <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Client Logos Strip ─────────────────────────────────── */}
      <section
        className="py-14 px-6"
        style={{ background: "#fff", borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB" }}
      >
        <div className="max-w-7xl mx-auto">
          <p
            className="text-xs font-semibold uppercase tracking-widest text-center mb-8"
            style={{ color: "#9CA3AF" }}
          >
            Trusted by modern businesses
          </p>
          <div className="flex items-center justify-center flex-wrap gap-10">
            {[
              "Northforge Industries",
              "Atlas & Stone",
              "HarborPeak Logistics",
              "Crestline Advisory",
              "Ironwood Supply",
            ].map((name) => (
              <span
                key={name}
                className="text-sm font-bold tracking-tight"
                style={{ color: "#D1D5DB" }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial ───────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto fade-up">
          <div
            className="rounded-3xl p-12 md:p-16 relative overflow-hidden"
            style={{ background: FINTRA_INK }}
          >
            {/* Glow */}
            <div
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(20,105,248,0.2) 0%, transparent 70%)",
              }}
            />
            <div className="relative">
              <div
                className="text-5xl font-bold mb-8 leading-none"
                style={{ color: "rgba(255,255,255,0.1)", fontFamily: '"Syne", sans-serif' }}
              >
                "
              </div>
              <blockquote
                className="text-2xl md:text-3xl font-bold text-white leading-tight mb-8"
                style={{
                  fontFamily: '"Syne", sans-serif',
                  letterSpacing: "-0.02em",
                  maxWidth: "640px",
                }}
              >
                Fintra completely changed how we handle billing. What used to take two days of reconciliation now happens automatically.
              </blockquote>
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: FINTRA_BLUE }}
                >
                  SJ
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Sarah Jenkins</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                    CFO · Crestline Advisory
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────── */}
      <section
        id="pricing"
        className="py-20 px-6"
        style={{ background: "#fff", borderTop: "1px solid #E5E7EB" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="fade-up mb-14">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: FINTRA_BLUE }}
            >
              Pricing
            </p>
            <h2
              className="text-3xl font-bold"
              style={{
                fontFamily: '"Syne", sans-serif',
                color: FINTRA_INK,
                letterSpacing: "-0.025em",
              }}
            >
              Simple. Transparent.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            {/* Starter */}
            <div
              className="fade-up rounded-2xl p-8 flex flex-col"
              style={{ border: "1px solid #E5E7EB", background: "#fff" }}
            >
              <div className="mb-6">
                <h3
                  className="text-base font-bold mb-1"
                  style={{ fontFamily: '"Syne", sans-serif', color: FINTRA_INK }}
                >
                  Starter
                </h3>
                <p className="text-xs" style={{ color: "#9CA3AF" }}>
                  Freelancers and new businesses.
                </p>
              </div>
              <div className="mb-8">
                <span
                  className="text-4xl font-bold"
                  style={{
                    fontFamily: '"IBM Plex Mono", monospace',
                    color: FINTRA_INK,
                    letterSpacing: "-0.02em",
                  }}
                >
                  $0
                </span>
                <span className="text-sm ml-1" style={{ color: "#9CA3AF" }}>
                  / month
                </span>
              </div>
              <Link
                href="/register"
                id="pricing-starter-cta"
                className="w-full py-2.5 mb-8 text-sm font-semibold text-center rounded-xl transition-all"
                style={{
                  color: FINTRA_INK,
                  border: "1px solid #E5E7EB",
                  background: "#F9FAFB",
                }}
              >
                Get started
              </Link>
              <ul className="space-y-3 flex-1">
                {[
                  "Up to 10 invoices / month",
                  "Basic client management",
                  "Standard email delivery",
                  "Stripe & Paystack integration",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-sm"
                    style={{ color: "#374151" }}
                  >
                    <CheckCircle2 size={15} style={{ color: "#10B981", flexShrink: 0, marginTop: "1px" }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Professional */}
            <div
              className="fade-up rounded-2xl p-8 flex flex-col relative"
              style={{ background: FINTRA_INK }}
            >
              <div
                className="absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: FINTRA_BLUE, color: "#fff" }}
              >
                Popular
              </div>
              <div className="mb-6">
                <h3
                  className="text-base font-bold text-white mb-1"
                  style={{ fontFamily: '"Syne", sans-serif' }}
                >
                  Professional
                </h3>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Growing teams with advanced needs.
                </p>
              </div>
              <div className="mb-8">
                <span
                  className="text-4xl font-bold text-white"
                  style={{
                    fontFamily: '"IBM Plex Mono", monospace',
                    letterSpacing: "-0.02em",
                  }}
                >
                  $15
                </span>
                <span className="text-sm ml-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                  / month
                </span>
              </div>
              <Link
                href="/register"
                id="pricing-pro-cta"
                className="w-full py-2.5 mb-8 text-sm font-semibold text-white text-center rounded-xl transition-all"
                style={{
                  background: FINTRA_BLUE,
                  boxShadow: "0 2px 8px rgba(20,105,248,0.4)",
                }}
              >
                Start 14-day trial
              </Link>
              <ul className="space-y-3 flex-1">
                {[
                  "Unlimited invoices",
                  "Advanced analytics & reporting",
                  "Custom branding",
                  "Automated payment reminders",
                  "Priority 24/7 support",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-sm"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    <CheckCircle2 size={15} style={{ color: "#3884FF", flexShrink: 0, marginTop: "1px" }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Band ──────────────────────────────────────────── */}
      <section
        className="py-24 px-6"
        style={{ background: FINTRA_INK }}
      >
        <div className="max-w-4xl mx-auto fade-up">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-5"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Get started today
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight"
            style={{
              fontFamily: '"Syne", sans-serif',
              letterSpacing: "-0.03em",
              maxWidth: "580px",
            }}
          >
            Stop chasing payments.{" "}
            <span style={{ color: FINTRA_BLUE }}>Start scaling revenue.</span>
          </h2>
          <p
            className="text-base mb-10"
            style={{ color: "rgba(255,255,255,0.45)", maxWidth: "480px" }}
          >
            Join thousands of businesses that invoice, collect, and grow with Fintra.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/register"
              id="cta-band-register"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold text-white rounded-xl transition-all"
              style={{
                background: FINTRA_BLUE,
                boxShadow: "0 4px 16px rgba(20,105,248,0.4)",
              }}
            >
              Create Free Account <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-medium rounded-xl transition-all"
              style={{
                color: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              Sign in
            </Link>
          </div>
          <p className="mt-5 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            No credit card required. Free forever on Starter.
          </p>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer
        className="py-16 px-6"
        style={{ background: "#0A0A0A", borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {/* Brand col */}
            <div className="col-span-2 md:col-span-1">
              <div className="mb-5">
                <FintraLogo dark />
              </div>
              <p className="text-sm max-w-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                The invoicing platform for businesses that value speed, precision, and getting paid.
              </p>
            </div>

            {[
              {
                heading: "Product",
                links: ["Features", "Pricing", "Integrations", "Changelog"],
                hrefs: ["/features", "/pricing", "/integrations", "/changelog"],
              },
              {
                heading: "Resources",
                links: ["Documentation", "Blog", "Guides", "Help Center"],
                hrefs: ["/docs", "/blog", "/guides", "/help"],
              },
              {
                heading: "Company",
                links: ["About", "Careers", "Legal & Privacy", "Contact"],
                hrefs: ["/about", "/careers", "/legal", "/contact"],
              },
            ].map((col) => (
              <div key={col.heading}>
                <h4
                  className="text-xs font-semibold uppercase tracking-widest mb-4"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  {col.heading}
                </h4>
                <ul className="space-y-3">
                  {col.links.map((link, i) => (
                    <li key={link}>
                      <Link
                        href={col.hrefs[i]}
                        className="text-sm transition-colors"
                        style={{ color: "rgba(255,255,255,0.45)" }}
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLElement).style.color = "#fff")
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLElement).style.color =
                            "rgba(255,255,255,0.45)")
                        }
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
              &copy; {new Date().getFullYear()} Fintra Technologies Ltd. All rights reserved.
            </p>
            <div className="flex gap-4">
              {["Twitter", "LinkedIn", "GitHub"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-xs transition-colors"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.25)")
                  }
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
