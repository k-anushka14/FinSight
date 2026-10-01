import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useUser } from "@clerk/react";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  CircleDollarSign,
  Download,
  FileCheck2,
  Info,
  Lightbulb,
  Plus,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";
import { compact, formatDate, inr, type BusinessBootstrap } from "@/lib/financials";
import { calculateFinancials } from "@/lib/financials";
import { PageHeader } from "../components/ui/PageHeader";
import { StatCard } from "../components/ui/StatCard";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";
import { FinancialHealthGauge } from "../components/dashboard/FinancialHealthGauge";
import { RevenueExpenseChart } from "../components/dashboard/RevenueExpenseChart";
import { SpendMixDonut } from "../components/dashboard/SpendMixDonut";
import { CashForecastChart } from "../components/dashboard/CashForecastChart";
import { RecordModal } from "../components/modals/RecordModal";
import type { Lang } from "../lib/i18n";

function greetingFor(lang: Lang): string {
  const hour = new Date().getHours();
  if (lang === "hi") {
    if (hour < 12) return "शुभ प्रभात";
    if (hour < 17) return "नमस्कार";
    return "शुभ संध्या";
  }
  if (lang === "mr") {
    if (hour < 12) return "शुभ सकाळ";
    if (hour < 17) return "नमस्कार";
    return "शुभ संध्याकाळ";
  }
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

interface DashboardPageProps {
  data: BusinessBootstrap;
  onRefresh: () => void;
}

export function DashboardPage({ data, onRefresh }: DashboardPageProps) {
  const { user } = useUser();
  const { lang } = useLanguage();
  const [, setLocation] = useLocation();
  const [period, setPeriod] = useState("This financial year");
  const [showExpense, setShowExpense] = useState(false);
  const [showRevenue, setShowRevenue] = useState(false);

  const f = calculateFinancials(data);

  return (
    <div className="space-y-8 animate-rise">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_68%)]" />
      {/* PAGE HEADER */}
      <PageHeader
        kicker={`${data.business.name} · ${data.business.location}`}
        title={`${greetingFor(lang)}, ${user?.firstName ?? data.business.name.split(" ")[0]}.`}
        description={
          f.populated
            ? "Here is the financial intelligence pulse of your business. Cash positions, spend trajectory, and working capital are synced live."
            : "Your financial command center is ready. Add your first transactions to activate AI forecasting and financial diagnostics."
        }
        action={
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              aria-label="Select reporting period"
              className="h-10 rounded-xl border border-white/[0.08] bg-[#111722] px-3.5 text-xs font-semibold text-zinc-200 outline-none hover:border-white/[0.15] transition"
            >
              <option value="This financial year" className="bg-[#111722] text-white">
                This financial year
              </option>
              <option value="Last 6 months" className="bg-[#111722] text-white">
                Last 6 months
              </option>
              <option value="This quarter" className="bg-[#111722] text-white">
                This quarter
              </option>
            </select>

            <Link
              href="/reports"
              className="btn-secondary inline-flex h-10 items-center gap-2 rounded-xl px-4 text-xs font-semibold"
            >
              <Download size={14} />
              <span>Snapshot</span>
            </Link>

            <button
              type="button"
              onClick={() => setShowRevenue(true)}
              className="btn-primary inline-flex h-10 items-center gap-1.5 rounded-xl px-4 text-xs font-semibold"
            >
              <Plus size={15} />
              <span>Add Revenue</span>
            </button>
          </div>
        }
      />

      {/* 5 KPI METRICS */}
      <div className="dashboard-stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          label="Total Revenue"
          value={compact(f.revenue)}
          delta={f.populated ? "Live Inflow" : undefined}
          trend="up"
          subtitle={`${data.revenue.length} transactions`}
          icon={TrendingUp}
          tone="emerald"
          onClick={() => setLocation("/revenue")}
        />

        <StatCard
          label="Total Expenses"
          value={compact(f.expenseTotal)}
          delta={f.populated ? "Burn Rate" : undefined}
          trend="down"
          subtitle={`${data.transactions.filter((t) => t.type === "expense").length} records`}
          icon={TrendingDown}
          tone="amber"
          onClick={() => setLocation("/transactions")}
        />

        <StatCard
          label="Net Cash Flow"
          value={compact(f.netCashFlow)}
          delta={f.populated ? (f.netCashFlow >= 0 ? "+ Positive" : "- Deficit") : undefined}
          trend={f.netCashFlow >= 0 ? "up" : "down"}
          subtitle="Operating delta"
          icon={Activity}
          tone={f.netCashFlow >= 0 ? "cyan" : "rose"}
          onClick={() => setLocation("/forecast")}
        />

        <StatCard
          label="Current Cash"
          value={compact(f.currentCash)}
          delta="Liquid Reserves"
          subtitle="Opening + Net"
          icon={CircleDollarSign}
          tone="blue"
          onClick={() => setLocation("/settings")}
        />

        <StatCard
          label="Receivables Due"
          value={compact(f.receivables)}
          delta={f.overdueReceivableAmount > 0 ? `${compact(f.overdueReceivableAmount)} overdue` : "On track"}
          subtitle={`${data.receivables.length} outstanding`}
          icon={WalletCards}
          tone="purple"
          onClick={() => setLocation("/receivables")}
        />
      </div>

      {/* PERFORMANCE & FINANCIAL HEALTH ROW */}
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        {/* Performance Chart Card */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 card-hover-effect">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400">
                Operating Velocity
              </div>
              <h2 className="font-display text-base sm:text-lg font-bold text-white">
                Revenue vs Expenses
              </h2>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <span className="size-2 rounded-full bg-emerald-400 glow-dot-emerald" />
                Revenue
              </span>
              <span className="flex items-center gap-1.5 text-zinc-300">
                <span className="size-2 rounded-full bg-amber-400 glow-amber" />
                Expenses
              </span>
            </div>
          </div>

          {f.monthly.length ? (
            <div className="chart-reveal">
              <RevenueExpenseChart data={f.monthly} height={280} />
            </div>
          ) : (
            <EmptyState
              title="No Monthly Velocity Yet"
              text="Add revenue and expenses to unlock your interactive performance trend line."
              action="Record First Expense"
              onClick={() => setShowExpense(true)}
            />
          )}
        </div>

        {/* Financial Health Gauge Card */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 card-hover-effect">
          <div className="mb-5 flex items-center justify-between border-b border-white/[0.06] pb-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-400">
                AI Diagnostics
              </div>
              <h2 className="font-display text-base sm:text-lg font-bold text-white">
                Financial Health Pulse
              </h2>
            </div>
            <Info size={16} className="text-zinc-500" />
          </div>

          <FinancialHealthGauge
            score={f.score}
            breakdown={f.healthBreakdown}
            populated={f.populated}
            onAddRevenue={() => setShowRevenue(true)}
          />
        </div>
      </div>

      {/* INTELLIGENCE & FORECAST ROW */}
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Spend Mix Card */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 card-hover-effect">
          <div className="mb-5 flex items-center justify-between border-b border-white/[0.06] pb-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400">
                Cost Allocation
              </div>
              <h2 className="font-display text-base sm:text-lg font-bold text-white">
                Where Expenses Went
              </h2>
            </div>
            <Link
              href="/analytics"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
            >
              <span>Detailed Breakdown</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {f.categories.length ? (
            <SpendMixDonut categories={f.categories} totalExpense={f.expenseTotal} />
          ) : (
            <EmptyState
              title="No Expense Categories Yet"
              text="Categorize your operational expenses to visualize where money is flowing."
              action="Add First Expense"
              onClick={() => setShowExpense(true)}
            />
          )}
        </div>

        {/* 90-Day Cash Forecast Card */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 card-hover-effect">
          <div className="mb-5 flex items-center justify-between border-b border-white/[0.06] pb-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-400">
                Liquidity Runway
              </div>
              <h2 className="font-display text-base sm:text-lg font-bold text-white">
                90-Day Cash Flow Forecast
              </h2>
            </div>
            <Badge tone={f.populated ? "emerald" : "neutral"} dot>
              {f.populated ? "Projected" : "Needs Data"}
            </Badge>
          </div>

          {f.populated ? (
            <CashForecastChart data={f.forecast} height={200} />
          ) : (
            <EmptyState
              title="Forecast Needs a Baseline"
              text="Add revenue and expenses to calculate your 30/60/90-day cash position."
              action="Add Revenue"
              onClick={() => setShowRevenue(true)}
            />
          )}
        </div>
      </div>

      {/* ACTION CENTER & COLLECTIONS ROW */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Receivables to Watch */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 card-hover-effect">
          <div className="mb-5 flex items-center justify-between border-b border-white/[0.06] pb-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-400">
                Cash Inflow Watch
              </div>
              <h2 className="font-display text-base sm:text-lg font-bold text-white">
                Receivables to Collect
              </h2>
            </div>
            <Link
              href="/receivables"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {data.receivables.length ? (
            <div className="divide-y divide-white/[0.04]">
              {data.receivables.slice(0, 4).map((c) => {
                const isOverdue = c.status === "Overdue";
                return (
                  <div
                    key={c.id}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0 hover:bg-white/[0.02] px-2 rounded-xl transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="grid size-9 place-items-center rounded-xl border border-white/[0.08] bg-[#161F2E] text-xs font-bold text-emerald-400">
                        {c.customer.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-xs font-semibold text-white">
                          {c.customer}
                        </div>
                        <div className="text-[11px] text-zinc-500 font-mono">
                          {c.invoice} · Due {formatDate(c.dueDate)}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 space-y-1">
                      <div className="font-mono text-xs font-bold text-white">
                        {compact(c.amount)}
                      </div>
                      <Badge
                        tone={isOverdue ? "rose" : "amber"}
                        size="sm"
                        dot
                      >
                        {c.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No Receivables Tracked"
              text="Add a customer and invoice receivable to protect your cash inflows."
              action="Add Receivable"
              onClick={() => setLocation("/receivables")}
            />
          )}
        </div>

        {/* Action Center & Anomaly Signals */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 card-hover-effect">
          <div className="mb-5 flex items-center justify-between border-b border-white/[0.06] pb-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-rose-400">
                AI Signals
              </div>
              <h2 className="font-display text-base sm:text-lg font-bold text-white">
                Action Center & Alerts
              </h2>
            </div>
            <Link
              href="/alerts"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1"
            >
              <span>Alert Center</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {f.populated ? (
            <div className="space-y-3">
              {f.anomalies.length > 0 ? (
                f.anomalies.slice(0, 2).map((anomaly) => (
                  <div
                    key={anomaly.category}
                    className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 transition hover:border-amber-500/30"
                  >
                    <div className="flex items-start gap-3">
                      <div className="grid size-8 shrink-0 place-items-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400">
                        <AlertCircle size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-amber-300">
                          {anomaly.category} Spend Surge Detected
                        </div>
                        <p className="mt-1 text-[11px] text-zinc-400 leading-relaxed">
                          {anomaly.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5">
                  <div className="flex items-start gap-3">
                    <div className="grid size-8 shrink-0 place-items-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                      <Activity size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-emerald-300">
                        Category Burn Within Thresholds
                      </div>
                      <p className="mt-1 text-[11px] text-zinc-400 leading-relaxed">
                        No anomalous cost spikes identified across historical operating baselines.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Collection Opportunity card */}
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5">
                <div className="flex items-start gap-3">
                  <div className="grid size-8 shrink-0 place-items-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                    <Lightbulb size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">
                      Working Capital Opportunity
                    </div>
                    <p className="mt-1 text-[11px] text-zinc-400 leading-relaxed">
                      {f.overdueReceivableAmount > 0
                        ? `${compact(f.overdueReceivableAmount)} in pending customer payments is overdue and ready for immediate reminder.`
                        : data.receivables.length > 0
                        ? `${data.receivables.length} receivable items are progressing within standard payment terms.`
                        : "Log customer credit terms and receivables to optimize cash conversion cycle."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              title="No Signals Detected"
              text="Add transactions to allow FinSight's AI to baseline your spending patterns and flag anomalies."
              action="Add Transaction"
              onClick={() => setShowExpense(true)}
            />
          )}
        </div>
      </div>

      {/* MODALS */}
      {showExpense && (
        <RecordModal
          kind="expense"
          onClose={() => setShowExpense(false)}
          onRecordSaved={onRefresh}
        />
      )}
      {showRevenue && (
        <RecordModal
          kind="revenue"
          onClose={() => setShowRevenue(false)}
          onRecordSaved={onRefresh}
        />
      )}
    </div>
  );
}
