import { useState } from "react";
import { ArrowDownRight, Clock3, Plus, ShieldCheck } from "lucide-react";
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

interface PayablesPageProps {
  data: BusinessBootstrap;
  onRefresh: () => void;
}

export function PayablesPage({ data, onRefresh }: PayablesPageProps) {
  const [showAdd, setShowAdd] = useState(false);
  const total = data.payables.reduce((sum, item) => sum + item.amount, 0);
  const financials = calculateFinancials(data);

  return (
    <div className="space-y-6 animate-rise">
      <PageHeader
        kicker="Supplier Obligations"
        title="Payables & Bills Due"
        description={
          data.payables.length
            ? `${compact(total)} is scheduled across ${data.payables.length} upcoming supplier obligations. Manage payment priority to preserve supplier terms.`
            : "Capture upcoming vendor and contractor bills to schedule outflows without running into cash crunches."
        }
        action={
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="btn-primary inline-flex h-10 items-center gap-1.5 rounded-xl px-4 text-xs font-semibold"
          >
            <Plus size={15} />
            <span>Add Payable</span>
          </button>
        }
      />

      {/* 3 Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Scheduled"
          value={compact(total)}
          delta="Committed Outflows"
          icon={ArrowDownRight}
          tone="amber"
        />
        <StatCard
          label="Open Obligations"
          value={String(data.payables.length)}
          delta="Supplier Bills"
          icon={Clock3}
          tone="rose"
        />
        <StatCard
          label="Current Cash Buffer"
          value={compact(financials.currentCash)}
          delta={financials.currentCash >= total ? "Fully Covered" : "Buffer Warning"}
          icon={ShieldCheck}
          tone={financials.currentCash >= total ? "emerald" : "amber"}
        />
      </div>

      {/* Payables Table */}
      <div className="glass-card rounded-2xl overflow-hidden card-hover-effect">
        <div className="border-b border-white/[0.06] p-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-400">
            Disbursement Queue
          </div>
          <h2 className="font-display text-base font-bold text-white">
            Upcoming Supplier Payments & Priority
          </h2>
        </div>

        {data.payables.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-xs">
              <thead className="border-b border-white/[0.06] bg-white/[0.02] text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                <tr>
                  <th className="px-5 py-3.5">Supplier / Vendor</th>
                  <th className="px-5 py-3.5">Bill Reference</th>
                  <th className="px-5 py-3.5 text-right">Amount</th>
                  <th className="px-5 py-3.5">Due Date</th>
                  <th className="px-5 py-3.5 text-center">Priority</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {data.payables.map((p) => {
                  const isHigh = p.priority === "High";
                  const isMedium = p.priority === "Medium";
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <span className="grid size-8 place-items-center rounded-lg border border-white/[0.08] bg-[#161F2E] text-[10px] font-bold text-amber-400">
                            {p.vendor.slice(0, 2).toUpperCase()}
                          </span>
                          <span className="font-semibold text-white">
                            {p.vendor}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono text-zinc-400">
                        {p.reference}
                      </td>
                      <td className="px-5 py-4 text-right font-mono font-bold text-white">
                        {inr(p.amount)}
                      </td>
                      <td className="px-5 py-4 font-mono text-zinc-400">
                        {formatDate(p.dueDate)}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <Badge
                          tone={isHigh ? "rose" : isMedium ? "amber" : "neutral"}
                          size="sm"
                          dot
                        >
                          {p.priority}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <Badge tone="amber" size="sm">
                          {p.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 sm:p-12">
            <EmptyState
              icon={ArrowDownRight}
              title="No upcoming payables"
              text="Add your next supplier invoice or payment obligation to map future cash outflows."
              action="Add Payable"
              onClick={() => setShowAdd(true)}
            />
          </div>
        )}
      </div>

      {showAdd && (
        <RecordModal
          kind="payable"
          onClose={() => setShowAdd(false)}
          onRecordSaved={onRefresh}
        />
      )}
    </div>
  );
}
