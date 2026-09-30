import { useState } from "react";
import {
  AlertCircle,
  Check,
  Clock3,
  Lightbulb,
  PieChart,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import {
  calculateFinancials,
  type BusinessBootstrap,
} from "@/lib/financials";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";

interface AlertsPageProps {
  data: BusinessBootstrap;
}

const actionTypeLabel: Record<string, string> = {
  anomaly: "Spend Anomaly",
  collections: "Cash Inflow",
  payables: "Payable Due",
  budget: "Budget Alert",
  baseline: "Operational Pulse",
};

const actionIcon: Record<string, any> = {
  anomaly: AlertCircle,
  collections: WalletCards,
  payables: Clock3,
  budget: PieChart,
  baseline: Lightbulb,
};

export function AlertsPage({ data }: AlertsPageProps) {
  const f = calculateFinancials(data);
  const [done, setDone] = useState<string[]>([]);

  const actions = f.actions.map((action) => ({
    id: action.id,
    type: actionTypeLabel[action.kind] || "Signal",
    title: action.title,
    text: action.text,
    tone: action.tone,
    icon: actionIcon[action.kind] || AlertCircle,
  }));

  // Financial radar coverage calculation
  const coverageParts = [
    data.transactions.length > 0,
    data.customers.length > 0,
    data.vendors.length > 0,
    data.receivables.length > 0,
    data.payables.length > 0,
    data.budgets.length > 0,
    f.monthly.length > 1,
  ];
  const coverage = Math.round(
    (coverageParts.filter(Boolean).length / coverageParts.length) * 100,
  );

  return (
    <div className="space-y-6 animate-rise">
      <PageHeader
        kicker="Action Intelligence"
        title="Alerts & Decision Recommendations"
        description="FinSight continuously monitors incoming transaction records and flags cash flow friction points, budget deviations, and urgent receivables."
        action={
          <Badge tone={actions.length ? "amber" : "emerald"} size="md" dot>
            {actions.length} Action Signals Active
          </Badge>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        {/* Actions List */}
        <div className="space-y-4">
          {actions.length ? (
            actions.map((a) => {
              const Icon = a.icon;
              const isDone = done.includes(a.id);
              const toneBg =
                a.tone === "amber"
                  ? "bg-amber-500/10 border-amber-500/25 text-amber-400"
                  : a.tone === "red"
                  ? "bg-rose-500/10 border-rose-500/25 text-rose-400"
                  : a.tone === "blue"
                  ? "bg-blue-500/10 border-blue-500/25 text-blue-400"
                  : "bg-emerald-500/10 border-emerald-500/25 text-emerald-400";

              return (
                <div
                  key={a.id}
                  className={`glass-card rounded-2xl p-5 card-hover-effect transition-all duration-200 ${
                    isDone ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`grid size-11 shrink-0 place-items-center rounded-xl border shadow-sm ${toneBg}`}
                    >
                      <Icon size={20} strokeWidth={2} />
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                          {a.type}
                        </span>
                        {isDone && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                            <Check size={11} /> Resolved
                          </span>
                        )}
                      </div>

                      <h3 className="font-display text-sm sm:text-base font-bold text-white">
                        {a.title}
                      </h3>

                      <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                        {a.text}
                      </p>

                      <div className="pt-3">
                        <button
                          type="button"
                          onClick={() => {
                            if (!isDone) setDone([...done, a.id]);
                            else setDone(done.filter((id) => id !== a.id));
                          }}
                          className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                            isDone
                              ? "bg-white/[0.04] text-zinc-400 border border-white/[0.08] hover:bg-white/[0.08]"
                              : "btn-primary"
                          }`}
                        >
                          {isDone ? "Mark as Unresolved" : "Mark as Reviewed"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="glass-card rounded-2xl p-8 text-center">
              <EmptyState
                icon={ShieldCheck}
                title="All Clear — No Urgent Alerts"
                text="Your business financial signals are currently stable. Log new entries to keep proactive alerts active."
              />
            </div>
          )}
        </div>

        {/* Financial Radar Signal Quality Card */}
        <div className="glass-card rounded-2xl p-6 card-hover-effect h-fit space-y-6">
          <div className="border-b border-white/[0.06] pb-3">
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400">
              Signal Fidelity
            </div>
            <h3 className="font-display text-base font-bold text-white">
              Financial Radar Coverage
            </h3>
          </div>

          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative grid size-32 place-items-center">
              <svg className="size-32 -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="rgba(255, 255, 255, 0.06)"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#10B981"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - coverage / 100)}`}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-2xl font-extrabold text-white">
                  {coverage}%
                </span>
                <span className="text-[9px] uppercase tracking-wider text-zinc-500">
                  Radar Active
                </span>
              </div>
            </div>

            <div>
              <div className="font-semibold text-white text-xs">
                {coverage >= 70
                  ? "High Signal Quality"
                  : coverage >= 40
                  ? "Building Intelligence"
                  : "Calibration Phase"}
              </div>
              <p className="mt-1 text-xs text-zinc-400 leading-relaxed max-w-xs">
                {coverage >= 70
                  ? "Sufficient transaction, customer, and vendor depth for high-confidence warnings."
                  : "Adding recurring costs and monthly budgets will sharpen early warning precision."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
