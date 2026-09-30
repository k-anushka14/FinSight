import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChart3,
  FileCheck2,
  MessageCircle,
  Plus,
  TrendingUp,
} from "lucide-react";
import {
  calculateFinancials,
  compact,
  formatDate,
  inr,
  type BusinessBootstrap,
} from "@/lib/financials";
import { PageHeader } from "../components/ui/PageHeader";
import { StatCard } from "../components/ui/StatCard";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";
import { RecordModal } from "../components/modals/RecordModal";

interface RevenuePageProps {
  data: BusinessBootstrap;
  onRefresh: () => void;
}

function RevenueTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/[0.1] bg-[#111722]/95 p-3 shadow-2xl backdrop-blur-xl text-xs space-y-1">
        <div className="font-semibold text-zinc-300 border-b border-white/[0.08] pb-1">
          {label}
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-zinc-400">
            <span className="size-2 rounded-full bg-emerald-400" />
            Revenue:
          </span>
          <span className="font-mono font-bold text-emerald-400">
            {inr(payload[0].value)}
          </span>
        </div>
      </div>
    );
  }
  return null;
}

export function RevenuePage({ data, onRefresh }: RevenuePageProps) {
  const f = calculateFinancials(data);
  const [showAdd, setShowAdd] = useState(false);

  const avgEntry = f.revenueEntries.length
    ? f.revenue / f.revenueEntries.length
    : 0;

  return (
    <div className="space-y-6 animate-rise">
      <PageHeader
        kicker="Money Earned"
        title="Revenue Overview"
        description="Recorded customer revenue entries are stored with your workspace and feed into every real-time cash flow and runway forecast."
        action={
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="btn-primary inline-flex h-10 items-center gap-1.5 rounded-xl px-4 text-xs font-semibold"
          >
            <Plus size={15} />
            <span>Add Revenue</span>
          </button>
        }
      />

      {/* 3 Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Revenue"
          value={compact(f.revenue)}
          delta="Cumulative Inflow"
          icon={TrendingUp}
          tone="emerald"
        />
        <StatCard
          label="Average Ticket"
          value={compact(avgEntry)}
          delta="Per Inflow"
          icon={BarChart3}
          tone="cyan"
        />
        <StatCard
          label="Revenue Transactions"
          value={String(f.revenueEntries.length)}
          delta="Recorded"
          icon={FileCheck2}
          tone="blue"
        />
      </div>

      {/* Revenue Performance Chart */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 card-hover-effect">
        <div className="mb-5 flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400">
              Inflow Velocity
            </div>
            <h2 className="font-display text-base sm:text-lg font-bold text-white">
              Revenue Performance Trend
            </h2>
          </div>
          <Badge tone={f.revenueEntries.length ? "emerald" : "neutral"} dot>
            {f.revenueEntries.length ? "Active Cashflow" : "Awaiting Data"}
          </Badge>
        </div>

        {f.monthly.length ? (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
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
                <Tooltip content={<RevenueTooltip />} />
                <Bar
                  dataKey="revenue"
                  name="Revenue"
                  fill="#10B981"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState
            icon={TrendingUp}
            title="No revenue logged yet"
            text="Add your first customer revenue entry to start plotting your income trend line."
            action="Record First Revenue"
            onClick={() => setShowAdd(true)}
          />
        )}
      </div>

      {/* Revenue Ledger Table */}
      <div className="glass-card rounded-2xl overflow-hidden card-hover-effect">
        <div className="border-b border-white/[0.06] p-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400">
            Recorded Inflows
          </div>
          <h2 className="font-display text-base font-bold text-white">
            Revenue Ledger
          </h2>
        </div>

        {f.revenueEntries.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-xs">
              <thead className="border-b border-white/[0.06] bg-white/[0.02] text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                <tr>
                  <th className="px-5 py-3.5">Description</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5 text-right">Amount</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {f.revenueEntries.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">
                        {t.description}
                      </div>
                      {t.source === "whatsapp" && (
                        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/20">
                          <MessageCircle size={10} />
                          WhatsApp Inflow
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-zinc-300">
                      {t.customer || <span className="text-zinc-600">—</span>}
                    </td>
                    <td className="px-5 py-4 font-mono text-zinc-400">
                      {formatDate(t.date)}
                    </td>
                    <td className="px-5 py-4 text-right font-mono font-bold text-emerald-400">
                      +{inr(t.amount)}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <Badge tone="emerald" size="sm" dot>
                        {t.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 sm:p-12">
            <EmptyState
              title="No revenue entries yet"
              text="Your customer income ledger will appear here once transactions are recorded."
              action="Record Revenue"
              onClick={() => setShowAdd(true)}
            />
          </div>
        )}
      </div>

      {showAdd && (
        <RecordModal
          kind="revenue"
          onClose={() => setShowAdd(false)}
          onRecordSaved={onRefresh}
        />
      )}
    </div>
  );
}
