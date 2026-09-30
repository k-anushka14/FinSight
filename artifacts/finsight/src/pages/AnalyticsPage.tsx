import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  AlertCircle,
  Lightbulb,
  Package,
  PieChart,
  TrendingUp,
} from "lucide-react";
import {
  calculateFinancials,
  compact,
  inr,
  type BusinessBootstrap,
} from "@/lib/financials";
import { PageHeader } from "../components/ui/PageHeader";
import { StatCard } from "../components/ui/StatCard";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";

interface AnalyticsPageProps {
  data: BusinessBootstrap;
}

function AnalyticsTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/[0.1] bg-[#111722]/95 p-3 shadow-2xl backdrop-blur-xl text-xs space-y-1">
        <div className="font-semibold text-zinc-300 border-b border-white/[0.08] pb-1">
          {label} Expenses
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-zinc-400">
            <span className="size-2 rounded-full bg-amber-400" />
            Total Outflow:
          </span>
          <span className="font-mono font-bold text-amber-400">
            {inr(payload[0].value)}
          </span>
        </div>
      </div>
    );
  }
  return null;
}

export function AnalyticsPage({ data }: AnalyticsPageProps) {
  const f = calculateFinancials(data);

  const grossMargin = f.revenue
    ? `${Math.round((f.netCashFlow / f.revenue) * 100)}%`
    : "—";

  const costPerEntry = f.expenses.length
    ? compact(f.expenseTotal / f.expenses.length)
    : "—";

  return (
    <div className="space-y-6 animate-rise">
      <PageHeader
        kicker="Cost Intelligence"
        title="Expense Analytics"
        description="Understand what is moving your operating margins before it surfaces in your liquid bank balance."
        action={
          <Badge tone={f.populated ? "emerald" : "neutral"} dot>
            {f.populated ? "Live Financial Signal" : "Awaiting Data"}
          </Badge>
        }
      />

      {/* 3 Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Gross Margin"
          value={grossMargin}
          delta={f.revenue ? "Operating Cushion" : undefined}
          icon={PieChart}
          tone="emerald"
        />
        <StatCard
          label="Average Ticket Burn"
          value={costPerEntry}
          delta="Per Expense Item"
          icon={Package}
          tone="amber"
        />
        <StatCard
          label="Categories Tracked"
          value={String(f.categories.length)}
          delta="Cost Allocations"
          icon={Activity}
          tone="blue"
        />
      </div>

      {f.populated ? (
        <>
          <div className="grid gap-6 xl:grid-cols-2">
            {/* Expense Velocity Chart */}
            <div className="glass-card rounded-2xl p-5 sm:p-6 card-hover-effect">
              <div className="mb-5 flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-400">
                    Cost Trajectory
                  </div>
                  <h2 className="font-display text-base sm:text-lg font-bold text-white">
                    Monthly Expense Trend
                  </h2>
                </div>
                <Badge tone="amber" dot>
                  Burn Rate
                </Badge>
              </div>

              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={f.monthly}
                    margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                  >
                    <CartesianGrid
                      vertical={false}
                      stroke="rgba(255, 255, 255, 0.06)"
                      strokeDasharray="3 3"
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#94A3B8" }}
                      dy={6}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => compact(v)}
                      tick={{ fontSize: 10, fill: "#94A3B8" }}
                    />
                    <Tooltip content={<AnalyticsTooltip />} />
                    <Line
                      dataKey="expenses"
                      name="Total Expenses"
                      stroke="#F59E0B"
                      strokeWidth={3}
                      dot={{
                        fill: "#F59E0B",
                        r: 4,
                        strokeWidth: 2,
                        stroke: "#080B12",
                      }}
                      activeDot={{
                        r: 6,
                        fill: "#F59E0B",
                        stroke: "#080B12",
                        strokeWidth: 2,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Concentration */}
            <div className="glass-card rounded-2xl p-5 sm:p-6 card-hover-effect">
              <div className="mb-5 flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-400">
                    Cost Concentration
                  </div>
                  <h2 className="font-display text-base sm:text-lg font-bold text-white">
                    Category Allocation
                  </h2>
                </div>
                <span className="text-xs text-zinc-400 font-mono">
                  {f.categories.length} Segments
                </span>
              </div>

              <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin">
                {f.categories.map((c) => {
                  const pct = f.expenseTotal
                    ? Math.round((c.value / f.expenseTotal) * 100)
                    : 0;
                  return (
                    <div key={c.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className="size-2 rounded-full"
                            style={{ background: c.color }}
                          />
                          <span className="font-medium text-white">{c.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-zinc-400 text-[11px]">{pct}%</span>
                          <span className="font-mono font-bold text-white">{compact(c.value)}</span>
                        </div>
                      </div>

                      <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            background: c.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Decision Support Insights */}
          <div className="glass-card rounded-2xl p-5 sm:p-6 card-hover-effect">
            <div className="mb-5 border-b border-white/[0.06] pb-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400">
                Decision Support
              </div>
              <h2 className="font-display text-base sm:text-lg font-bold text-white">
                Automated Reads from Your Business Ledger
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-2 hover:border-emerald-500/20 transition">
                <div className="flex items-center gap-2 text-emerald-400">
                  <TrendingUp size={16} />
                  <span className="text-xs font-semibold text-white">
                    Cash Conversion
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {f.netCashFlow >= 0
                    ? `Your books demonstrate ${compact(f.netCashFlow)} of positive cash accumulation across active records.`
                    : "Expenditure velocity is currently running ahead of recognized revenue; check collection timing."}
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-2 hover:border-amber-500/20 transition">
                <div className="flex items-center gap-2 text-amber-400">
                  <AlertCircle size={16} />
                  <span className="text-xs font-semibold text-white">
                    Dominant Cost Center
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {f.categories[0]
                    ? `${f.categories[0].name} represents your primary operational expense line at ${compact(f.categories[0].value)}.`
                    : "Add categorized expenses to isolate top concentration risks."}
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-2 hover:border-cyan-500/20 transition">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Lightbulb size={16} />
                  <span className="text-xs font-semibold text-white">
                    Data Signal Coverage
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {data.transactions.length} active ledger transactions are currently feeding your intelligence insights and margin analytics.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="glass-card rounded-2xl p-8 sm:p-12 text-center">
          <EmptyState
            icon={PieChart}
            title="Insufficient Data for Analytics"
            text="Add more expenses and revenue transactions to unlock full margin analytics, concentration graphs, and decision support."
          />
        </div>
      )}
    </div>
  );
}
