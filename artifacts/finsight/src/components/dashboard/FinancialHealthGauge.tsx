import { ShieldCheck, TrendingUp, AlertTriangle } from "lucide-react";
import { Badge } from "../ui/Badge";

export interface HealthFactor {
  key: string;
  label: string;
  score: number;
}

export interface FinancialHealthGaugeProps {
  score: number;
  breakdown: HealthFactor[];
  populated: boolean;
  onAddRevenue?: () => void;
}

export function FinancialHealthGauge({
  score,
  breakdown,
  populated,
  onAddRevenue,
}: FinancialHealthGaugeProps) {
  if (!populated) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-3 grid size-12 place-items-center rounded-2xl border border-white/[0.08] bg-[#161F2E] text-emerald-400">
          <ShieldCheck size={24} />
        </div>
        <h4 className="font-display text-sm font-semibold text-white">
          Financial Health Signal
        </h4>
        <p className="mt-1 max-w-xs text-xs text-zinc-400">
          Record your first revenue or expense to calculate an AI health score and liquidity diagnostics.
        </p>
        {onAddRevenue && (
          <button
            type="button"
            onClick={onAddRevenue}
            className="btn-primary mt-4 inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold"
          >
            Add First Entry
          </button>
        )}
      </div>
    );
  }

  const isHealthy = score >= 70;
  const isWarning = score < 50;

  // SVG circular gauge math
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const strokeColor = isHealthy
    ? "url(#emeraldGradient)"
    : isWarning
    ? "url(#roseGradient)"
    : "url(#amberGradient)";

  return (
    <div className="space-y-6">
      {/* Top radial display */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative grid size-32 shrink-0 place-items-center">
          <svg className="size-32 -rotate-90" viewBox="0 0 128 128">
            <defs>
              <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
              <linearGradient id="amberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
              <linearGradient id="roseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="100%" stopColor="#F43F5E" />
              </linearGradient>
            </defs>

            {/* Background ring */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth="9"
              fill="transparent"
            />

            {/* Glowing progress stroke */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke={strokeColor}
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Centered score text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="font-display text-3xl font-extrabold tracking-tight text-white tabular-nums">
              {score}
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              out of 100
            </div>
          </div>
        </div>

        {/* Diagnosis & explanation */}
        <div className="flex-1 space-y-2 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <Badge
              tone={isHealthy ? "emerald" : isWarning ? "rose" : "amber"}
              dot
            >
              {isHealthy ? "Strong Financial Health" : isWarning ? "Cash Drag Alert" : "Building Resilience"}
            </Badge>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {isHealthy
              ? "Healthy liquidity margin and predictable receivables inflow. Working capital runway is optimal."
              : isWarning
              ? "Collection cycle or expense velocity requires prompt attention to maintain liquidity cushion."
              : "Operating baseline established. Adding regular recurring expense data improves projection fidelity."}
          </p>
        </div>
      </div>

      {/* Factor breakdown bars */}
      <div className="space-y-3 pt-4 border-t border-white/[0.06]">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
          Component Breakdown
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {breakdown.map((factor) => {
            const barTone =
              factor.score >= 70
                ? "bg-emerald-400"
                : factor.score >= 45
                ? "bg-amber-400"
                : "bg-rose-400";
            return (
              <div
                key={factor.key}
                className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-2.5"
              >
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-zinc-300 font-medium">{factor.label}</span>
                  <span className="font-mono text-xs font-semibold text-white">
                    {factor.score}%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barTone}`}
                    style={{ width: `${Math.min(100, Math.max(0, factor.score))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
