import { Link } from "wouter";
import {
  Activity,
  ArrowRight,
  Check,
  CircleDollarSign,
  FileCheck2,
  LineChart,
  MessageCircle,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Badge } from "../components/ui/Badge";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080B12] text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.08] bg-[#080B12]/80 px-6 py-4 backdrop-blur-xl sm:px-12">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative grid size-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-black shadow-lg shadow-emerald-500/20 transition-transform duration-200 group-hover:scale-105">
            <Activity size={22} strokeWidth={2.5} />
            <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-emerald-400 glow-dot-emerald animate-pulse" />
          </div>
          <div>
            <span className="block font-display text-lg font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
              FinSight
            </span>
            <span className="block text-[9px] font-semibold uppercase tracking-[0.22em] text-emerald-400/80">
              MSME Intelligence
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="rounded-xl px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.05] transition"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="btn-primary rounded-xl px-4 py-2 text-xs font-semibold"
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[650px] rounded-full bg-emerald-500/10 blur-[140px]" />
        <div className="pointer-events-none absolute top-1/3 -left-40 size-[500px] rounded-full bg-cyan-500/5 blur-[120px]" />

        <div className="mx-auto max-w-7xl px-6 pt-16 pb-24 sm:px-12 lg:pt-24">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            {/* Left Hero Pitch */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 backdrop-blur-md shadow-sm">
                <Sparkles size={13} className="text-emerald-400 animate-pulse" />
                <span>Next-Gen Financial Intelligence for MSMEs</span>
              </div>

              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.05]">
                Know your numbers.
                <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  Command your cash.
                </span>
              </h1>

              <p className="max-w-xl text-sm sm:text-base text-zinc-400 leading-relaxed">
                FinSight translates everyday bills, invoices, and bank inflows into a high-precision dark command center. Real-time liquidity runways, spend anomaly alerts, What-if simulator, and WhatsApp sync.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/sign-up"
                  className="btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold shadow-xl shadow-emerald-500/20"
                >
                  <span>Launch Workspace</span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/sign-in"
                  className="btn-secondary inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold"
                >
                  <span>Sign In</span>
                </Link>
              </div>

              {/* Trust Pills */}
              <div className="flex flex-wrap items-center gap-6 pt-6 text-xs text-zinc-400 border-t border-white/[0.06]">
                <span className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  Zero spreadsheet setup
                </span>
                <span className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  WhatsApp chat entry
                </span>
                <span className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  Private & encrypted
                </span>
              </div>
            </div>

            {/* Right Mock Command Center Preview */}
            <div className="relative">
              {/* Outer glow aura */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 blur-2xl opacity-60" />

              <div className="glass-card relative overflow-hidden rounded-2xl p-6 shadow-2xl border border-white/[0.12] space-y-5">
                {/* Header of Mock */}
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-8 place-items-center rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-display">
                      SP
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white">
                        Shree Packaging Solutions
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        Operational Command Center
                      </div>
                    </div>
                  </div>

                  <Badge tone="emerald" size="sm" dot>
                    Live Pulse
                  </Badge>
                </div>

                {/* 2 Mock Stat Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/[0.06] bg-[#0B0F17]/80 p-3.5 space-y-1">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                      Current Cash
                    </div>
                    <div className="font-display text-xl font-extrabold text-white">
                      ₹14.8L
                    </div>
                    <div className="text-[10px] text-emerald-400 font-semibold">
                      ↑ +12.4% Net Surplus
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/[0.06] bg-[#0B0F17]/80 p-3.5 space-y-1">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                      Health Score
                    </div>
                    <div className="font-display text-xl font-extrabold text-emerald-400">
                      84<span className="text-xs text-zinc-500">/100</span>
                    </div>
                    <div className="text-[10px] text-cyan-400 font-semibold">
                      Optimal Working Capital
                    </div>
                  </div>
                </div>

                {/* Mock Chart Area */}
                <div className="rounded-xl border border-white/[0.06] bg-[#0B0F17]/80 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">
                      Cash Velocity Outlook
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      +₹3.2L Inflow Expected
                    </span>
                  </div>

                  {/* Visual Bar Spectrum */}
                  <div className="flex h-20 items-end gap-1.5 pt-2">
                    {[35, 42, 38, 62, 54, 78, 68, 88, 94, 82, 92, 100].map(
                      (val, idx) => (
                        <div
                          key={idx}
                          className="flex-1 rounded-t-sm bg-gradient-to-t from-emerald-500/20 to-emerald-400 transition-all duration-300"
                          style={{ height: `${val}%` }}
                        />
                      ),
                    )}
                  </div>
                </div>

                {/* Mock WhatsApp Signal */}
                <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs">
                  <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#25D366] text-black">
                    <MessageCircle size={17} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-white text-[11px]">
                      New WhatsApp Receipt Synced
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate">
                      "Paid ₹4,500 for diesel generator" · Auto-classified under Utilities
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <section className="border-t border-white/[0.08] bg-[#070A0F] py-20 px-6 sm:px-12">
          <div className="mx-auto max-w-7xl space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
                Core Capabilities
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                Everything an MSME needs to stay cash-positive
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="glass-card rounded-2xl p-6 space-y-3">
                <div className="grid size-11 place-items-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <MessageCircle size={20} />
                </div>
                <h3 className="font-display text-base font-bold text-white">
                  WhatsApp Instant Capture
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Log operational expenses and daily sales straight from WhatsApp. Natural language parser identifies category, amount, and supplier on the fly.
                </p>
              </div>

              <div className="glass-card rounded-2xl p-6 space-y-3">
                <div className="grid size-11 place-items-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Target size={20} />
                </div>
                <h3 className="font-display text-base font-bold text-white">
                  What-If Sensitivity Simulator
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Test commodity spikes, freight hikes, or revenue contraction against your empirical books before making hiring or purchasing commitments.
                </p>
              </div>

              <div className="glass-card rounded-2xl p-6 space-y-3">
                <div className="grid size-11 place-items-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <FileCheck2 size={20} />
                </div>
                <h3 className="font-display text-base font-bold text-white">
                  Invoice OCR Intelligence
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Extract supplier, invoice number, due date, taxable subtotal, and 18% GST with automated confidence scoring. Eliminate manual bookkeeping errors.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
