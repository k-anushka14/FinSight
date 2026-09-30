import { useState } from "react";
import {
  Activity,
  CircleDollarSign,
  Lightbulb,
  RefreshCw,
  Sparkles,
  Target,
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

interface SimulatorPageProps {
  data: BusinessBootstrap;
}

export function SimulatorPage({ data }: SimulatorPageProps) {
  const f = calculateFinancials(data);
  const [values, setValues] = useState({
    revenue: 0,
    raw: 0,
    transport: 0,
    labour: 0,
  });

  const update = (key: keyof typeof values, value: string) =>
    setValues({ ...values, [key]: Number(value) });

  const resetAll = () =>
    setValues({ revenue: 0, raw: 0, transport: 0, labour: 0 });

  // Calculation models
  const projectedRevenue = f.revenue * (1 + values.revenue / 100);
  const projectedExpenses =
    f.expenseTotal *
    (1 +
      (values.raw * 0.39 + values.transport * 0.13 + values.labour * 0.2) /
        100);
  const projectedNet = projectedRevenue - projectedExpenses;
  const projectedCash = f.currentCash + projectedNet;
  const deltaFromBase = projectedNet - f.netCashFlow;

  return (
    <div className="space-y-6 animate-rise">
      <PageHeader
        kicker="Scenario Modeling"
        title="What-If Financial Simulator"
        description="Pressure-test commercial decisions before committing capital. Adjust revenue growth or cost drivers to simulate the net impact on cash flow."
        action={
          <button
            type="button"
            onClick={resetAll}
            className="btn-secondary inline-flex h-10 items-center gap-2 rounded-xl px-4 text-xs font-semibold"
          >
            <RefreshCw size={14} />
            <span>Reset Levers</span>
          </button>
        }
      />

      {f.populated ? (
        <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
          {/* Levers Card */}
          <div className="glass-card rounded-2xl p-5 sm:p-6 card-hover-effect space-y-6">
            <div className="border-b border-white/[0.06] pb-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400">
                Sensitivity Levers
              </div>
              <h2 className="font-display text-base sm:text-lg font-bold text-white">
                Adjust Operational Assumptions
              </h2>
            </div>

            <div className="space-y-6">
              {[
                { key: "revenue" as const, label: "Revenue Growth / Contraction", desc: "Top-line volume or price changes" },
                { key: "raw" as const, label: "Raw Material Costs", desc: "Input commodities and packaging price flux" },
                { key: "transport" as const, label: "Freight & Transport Costs", desc: "Fuel, logistics, and shipping variance" },
                { key: "labour" as const, label: "Labour & Wages", desc: "Staffing, overtime, and contracted hands" },
              ].map(({ key, label, desc }) => {
                const val = values[key];
                const isPositive = val > 0;
                const isNegative = val < 0;
                return (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-white">{label}</span>
                        <div className="text-[11px] text-zinc-400">{desc}</div>
                      </div>
                      <Badge
                        tone={
                          key === "revenue"
                            ? isPositive
                              ? "emerald"
                              : isNegative
                              ? "rose"
                              : "neutral"
                            : isPositive
                            ? "rose"
                            : isNegative
                            ? "emerald"
                            : "neutral"
                        }
                        size="md"
                      >
                        {val > 0 ? `+${val}%` : `${val}%`}
                      </Badge>
                    </div>

                    <input
                      type="range"
                      min="-20"
                      max="20"
                      step="1"
                      value={val}
                      onChange={(e) => update(key, e.target.value)}
                      className="w-full h-2 rounded-lg bg-white/[0.08] accent-emerald-500 cursor-pointer"
                    />

                    <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                      <span>-20%</span>
                      <span className="text-zinc-400 font-semibold">Baseline (0%)</span>
                      <span>+20%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-xs text-zinc-400 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <Lightbulb size={14} />
                <span>Base Case Figures</span>
              </div>
              <p className="leading-relaxed">
                Calibrated from {compact(f.revenue)} baseline revenue and {compact(f.expenseTotal)} total operating expenses recorded in your books.
              </p>
            </div>
          </div>

          {/* Results Projection */}
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard
                label="Simulated Revenue"
                value={compact(projectedRevenue)}
                delta={`${values.revenue > 0 ? "+" : ""}${values.revenue}% vs Base`}
                icon={TrendingUp}
                tone="emerald"
              />
              <StatCard
                label="Simulated Expenses"
                value={compact(projectedExpenses)}
                delta="Adjusted Outflow"
                icon={TrendingDown}
                tone="amber"
              />
              <StatCard
                label="Simulated Net Flow"
                value={compact(projectedNet)}
                delta={projectedNet >= 0 ? "+ Positive" : "- Deficit"}
                icon={Activity}
                tone={projectedNet >= 0 ? "cyan" : "rose"}
              />
              <StatCard
                label="Simulated Cash Position"
                value={compact(projectedCash)}
                delta="Reserve Horizon"
                icon={CircleDollarSign}
                tone="blue"
              />
            </div>

            {/* Plain English Scenario Insight Card */}
            <div className="glass-card rounded-2xl p-6 card-hover-effect">
              <div className="flex items-center gap-2 mb-3 text-emerald-400">
                <Sparkles size={18} />
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                  Scenario Bottom Line
                </h3>
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                  Under this simulated scenario, your business would generate{" "}
                  <span className="font-mono font-bold text-white">
                    {compact(Math.abs(deltaFromBase))}
                  </span>{" "}
                  {deltaFromBase >= 0 ? (
                    <span className="text-emerald-400 font-bold">more free cash flow</span>
                  ) : (
                    <span className="text-rose-400 font-bold">less cash flow</span>
                  )}{" "}
                  than your current recorded baseline.
                </p>
                <div className="mt-3 text-[11px] text-zinc-400">
                  {deltaFromBase >= 0
                    ? "✓ This setup strengthens your working capital reserves and extends runway."
                    : "⚠️ This configuration contracts your liquidity margin; consider compensatory revenue expansion or price adjustments."}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-8 sm:p-12 text-center">
          <EmptyState
            icon={Target}
            title="Baseline Data Required"
            text="Add your opening cash and initial transactions so the simulator has an empirical baseline to run sensitivity tests on."
          />
        </div>
      )}
    </div>
  );
}
