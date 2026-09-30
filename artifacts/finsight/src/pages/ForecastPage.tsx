import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, ShieldCheck, TrendingDown, TrendingUp } from "lucide-react";
import {
  calculateFinancials,
  compact,
  inr,
  type BusinessBootstrap,
} from "@/lib/financials";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";

interface ForecastPageProps {
  data: BusinessBootstrap;
}

function ForecastChartTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/[0.1] bg-[#111722]/95 p-3 shadow-2xl backdrop-blur-xl text-xs space-y-1.5">
        <div className="font-semibold text-zinc-300 border-b border-white/[0.08] pb-1">
          {label} Window
        </div>
        {payload.map((item: any) => (
          <div key={item.dataKey} className="flex justify-between gap-4">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <span
                className="size-2 rounded-full"
                style={{ background: item.stroke || item.fill }}
              />
              {item.name}:
            </span>
            <span className="font-mono font-bold text-white">
              {inr(item.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export function ForecastPage({ data }: ForecastPageProps) {
  const f = calculateFinancials(data);
  const [days, setDays] = useState(90);

  const selected =
    f.forecast.find((point) => point.days === days) ?? f.forecast[2];

  return (
    <div className="space-y-6 animate-rise">
      <PageHeader
        kicker="Forward Visibility"
        title="Cash-Flow Forecast & Runway"
        description="A mathematical model of when money arrives, when obligations leave, and the liquidity cushion your business can count on."
        action={
          <div className="flex items-center rounded-xl border border-white/[0.08] bg-[#111722] p-1 shadow-sm">
            {[30, 60, 90].map((horizon) => {
              const active = days === horizon;
              return (
                <button
                  type="button"
                  key={horizon}
                  onClick={() => setDays(horizon)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    active
                      ? "bg-emerald-500 text-black font-bold shadow-sm shadow-emerald-500/20"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {horizon} Days
                </button>
              );
            })}
          </div>
        }
      />

      {f.populated ? (
        <>
          {/* Main Forecast Chart Card */}
          <div className="glass-card rounded-2xl p-5 sm:p-6 card-hover-effect">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-400">
                  Calculated from Your Ledger
                </div>
                <h2 className="font-display text-base sm:text-lg font-bold text-white">
                  Projected Cash Trajectory ({days}-Day Horizon)
                </h2>
              </div>
              <Badge tone="emerald" dot>
                Live Predictive Model
              </Badge>
            </div>

            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={f.forecast}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#06B6D4" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    stroke="rgba(255, 255, 255, 0.06)"
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="label"
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
                  <Tooltip content={<ForecastChartTooltip />} />
                  <Area
                    dataKey="balance"
                    name="Closing Cash Balance"
                    stroke="#06B6D4"
                    strokeWidth={3}
                    fill="url(#balanceGrad)"
                    activeDot={{
                      r: 6,
                      fill: "#06B6D4",
                      stroke: "#080B12",
                      strokeWidth: 2,
                    }}
                  />
                  <Line
                    dataKey="inflow"
                    name="Projected Inflow"
                    stroke="#10B981"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    dot={{ fill: "#10B981", r: 4 }}
                  />
                  <Line
                    dataKey="outflow"
                    name="Projected Outflow"
                    stroke="#EF4444"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    dot={{ fill: "#EF4444", r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Model Assumptions & Selected Horizon Row */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Current Assumptions */}
            <div className="glass-card rounded-2xl p-5 sm:p-6 card-hover-effect">
              <div className="mb-4 border-b border-white/[0.06] pb-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400">
                  Model Baseline
                </div>
                <h3 className="font-display text-base font-bold text-white">
                  Forecast Driving Parameters
                </h3>
              </div>

              <div className="divide-y divide-white/[0.04] text-xs">
                {[
                  ["Opening Cash on Record", compact(data.business.openingCash)],
                  ["Historical Recognized Revenue", compact(f.revenue)],
                  ["Historical Logged Expenses", compact(f.expenseTotal)],
                  ["Monthly Recurring Commitments", compact(f.recurringMonthly)],
                  ["Receivables Pending Inflow", compact(f.receivables)],
                  ["Scheduled Supplier Payables", compact(f.payables)],
                ].map(([label, val]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-2.5"
                  >
                    <span className="text-zinc-400">{label}</span>
                    <span className="font-mono font-bold text-white">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Horizon Card */}
            <div className="glass-card rounded-2xl p-5 sm:p-6 card-hover-effect flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-400">
                  Target Projection
                </div>
                <h3 className="font-display text-base font-bold text-white">
                  Expected Closing Cash ({selected.label})
                </h3>
                <div
                  className={`mt-4 font-display text-4xl font-extrabold tracking-tight ${
                    selected.balance >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {compact(selected.balance)}
                </div>
                <div className="mt-2 text-xs text-zinc-400 leading-relaxed">
                  Calculated by integrating opening reserves with weighted 30-day run-rate revenue, scheduled customer collections, recurring commitments, and supplier due dates.
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <Badge
                  tone={selected.balance >= 0 ? "emerald" : "rose"}
                  size="md"
                  dot
                >
                  {selected.balance >= 0 ? "Sufficient Working Capital" : "Working Capital Deficit Warning"}
                </Badge>
                <div className="text-[11px] text-zinc-500 font-mono">
                  As of today
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="glass-card rounded-2xl p-8 sm:p-12 text-center">
          <EmptyState
            icon={Activity}
            title="Insufficient Baseline Data"
            text="Add your opening cash and first couple of transactions so FinSight can construct your 30/60/90-day cash projection."
          />
        </div>
      )}
    </div>
  );
}
