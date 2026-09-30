import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  calculateFinancials,
  compact,
  type BusinessBootstrap,
} from "@/lib/financials";
import { PageHeader } from "../components/ui/PageHeader";
import { StatCard } from "../components/ui/StatCard";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";

interface ChangesPageProps {
  data: BusinessBootstrap;
}

export function ChangesPage({ data }: ChangesPageProps) {
  const f = calculateFinancials(data);

  return (
    <div className="space-y-6 animate-rise">
      <PageHeader
        kicker="Period Analysis"
        title="Month-on-Month Trends"
        description="FinSight compares consecutive operating periods to isolate what shifted across revenue lines and cost drivers."
        action={
          <Badge tone={f.populated ? "emerald" : "neutral"} size="md" dot>
            {f.monthOverMonth?.hasComparison ? "Comparative Signal" : "Single Period"}
          </Badge>
        }
      />

      {/* 3 Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Current Revenue"
          value={compact(f.revenue)}
          icon={TrendingUp}
          tone="emerald"
        />
        <StatCard
          label="Current Expenses"
          value={compact(f.expenseTotal)}
          icon={TrendingDown}
          tone="amber"
        />
        <StatCard
          label="Net Operating Flow"
          value={compact(f.netCashFlow)}
          icon={Activity}
          tone={f.netCashFlow >= 0 ? "cyan" : "rose"}
        />
      </div>

      {/* Changes Comparison Card */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 card-hover-effect">
        <div className="mb-5 border-b border-white/[0.06] pb-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400">
            {f.monthOverMonth?.hasComparison
              ? `${f.monthOverMonth.currentLabel} vs ${f.monthOverMonth.previousLabel}`
              : "Delta Breakdown"}
          </div>
          <h2 className="font-display text-base sm:text-lg font-bold text-white">
            Key Financial Movement
          </h2>
        </div>

        {f.populated && f.monthOverMonth?.hasComparison ? (
          <div className="space-y-6">
            <div className="divide-y divide-white/[0.04]">
              {f.monthOverMonth.changes.map((change) => {
                const isPositiveDelta = change.deltaPct !== null && change.deltaPct > 0;
                return (
                  <div
                    key={change.label}
                    className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center justify-between hover:bg-white/[0.02] px-2 rounded-xl transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`grid size-9 place-items-center rounded-xl border ${
                          change.direction === "up"
                            ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                            : change.direction === "down"
                            ? "bg-rose-500/10 border-rose-500/25 text-rose-400"
                            : "bg-white/[0.04] border-white/[0.08] text-zinc-400"
                        }`}
                      >
                        {change.direction === "down" ? (
                          <ArrowDownRight size={17} />
                        ) : (
                          <ArrowUpRight size={17} />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">
                          {change.label}
                        </div>
                        <div className="text-[11px] text-zinc-400 font-mono">
                          {compact(change.previous)} in {f.monthOverMonth?.previousLabel} →{" "}
                          {compact(change.current)} in {f.monthOverMonth?.currentLabel}
                        </div>
                      </div>
                    </div>

                    <div>
                      <Badge
                        tone={
                          change.direction === "up"
                            ? "emerald"
                            : change.direction === "down"
                            ? "rose"
                            : "neutral"
                        }
                        size="md"
                      >
                        {change.deltaPct === null
                          ? "New"
                          : `${isPositiveDelta ? "+" : ""}${Math.round(change.deltaPct)}%`}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Category Moves */}
            {f.monthOverMonth.categoryChanges.length > 0 && (
              <div className="pt-4 border-t border-white/[0.06] space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Largest Category Shifts
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {f.monthOverMonth.categoryChanges.map((change) => (
                    <div
                      key={change.category}
                      className="flex items-center justify-between py-2.5 text-xs"
                    >
                      <span className="text-zinc-300 font-medium">{change.category}</span>
                      <span className="font-mono text-zinc-400">
                        {compact(change.previous)} → <span className="text-white font-bold">{compact(change.current)}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 sm:p-12 text-center">
            <EmptyState
              title="Comparison Requires Multi-Month Data"
              text="Log transactions spanning across multiple calendar months to activate automatic month-on-month trend variance."
            />
          </div>
        )}
      </div>
    </div>
  );
}
