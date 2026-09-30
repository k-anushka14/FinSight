import { useState } from "react";
import { AlertCircle, Clock3, Plus, WalletCards } from "lucide-react";
import { compact, formatDate, inr, type BusinessBootstrap } from "@/lib/financials";
import { PageHeader } from "../components/ui/PageHeader";
import { StatCard } from "../components/ui/StatCard";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";
import { RecordModal } from "../components/modals/RecordModal";

interface ReceivablesPageProps {
  data: BusinessBootstrap;
  onRefresh: () => void;
}

export function ReceivablesPage({ data, onRefresh }: ReceivablesPageProps) {
  const [showAdd, setShowAdd] = useState(false);
  const total = data.receivables.reduce((sum, item) => sum + item.amount, 0);
  const overdueTotal = data.receivables
    .filter((x) => x.status === "Overdue")
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6 animate-rise">
      <PageHeader
        kicker="Working Capital Inflow"
        title="Receivables & Invoices Due"
        description={
          data.receivables.length
            ? `${compact(total)} total is outstanding across ${data.receivables.length} customer invoice(s). Prioritize overdue collections to optimize cash flow.`
            : "Track customer invoices and outstanding balances so expected inflows stay visible before they affect your liquidity."
        }
        action={
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="btn-primary inline-flex h-10 items-center gap-1.5 rounded-xl px-4 text-xs font-semibold"
          >
            <Plus size={15} />
            <span>Add Receivable</span>
          </button>
        }
      />

      {/* 3 Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Outstanding"
          value={compact(total)}
          delta="Awaiting Settlement"
          icon={WalletCards}
          tone="amber"
        />
        <StatCard
          label="Open Invoices"
          value={String(data.receivables.length)}
          delta="Active Accounts"
          icon={Clock3}
          tone="cyan"
        />
        <StatCard
          label="Overdue Capital"
          value={compact(overdueTotal)}
          delta={overdueTotal > 0 ? "Requires Follow-up" : "All on Track"}
          icon={AlertCircle}
          tone={overdueTotal > 0 ? "rose" : "emerald"}
        />
      </div>

      {/* Receivables Table */}
      <div className="glass-card rounded-2xl overflow-hidden card-hover-effect">
        <div className="border-b border-white/[0.06] p-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400">
            Customer Aging Ledger
          </div>
          <h2 className="font-display text-base font-bold text-white">
            Collection Status & Due Dates
          </h2>
        </div>

        {data.receivables.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-xs">
              <thead className="border-b border-white/[0.06] bg-white/[0.02] text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                <tr>
                  <th className="px-5 py-3.5">Customer Name</th>
                  <th className="px-5 py-3.5">Invoice #</th>
                  <th className="px-5 py-3.5 text-right">Amount</th>
                  <th className="px-5 py-3.5">Due Date</th>
                  <th className="px-5 py-3.5 text-center">Collection Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {data.receivables.map((c) => {
                  const isOverdue = c.status === "Overdue";
                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <span className="grid size-8 place-items-center rounded-lg border border-white/[0.08] bg-[#161F2E] text-[10px] font-bold text-emerald-400">
                            {c.customer.slice(0, 2).toUpperCase()}
                          </span>
                          <span className="font-semibold text-white">
                            {c.customer}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono text-zinc-400">
                        {c.invoice}
                      </td>
                      <td className="px-5 py-4 text-right font-mono font-bold text-white">
                        {inr(c.amount)}
                      </td>
                      <td className="px-5 py-4 font-mono text-zinc-400">
                        {formatDate(c.dueDate)}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <Badge
                          tone={isOverdue ? "rose" : c.status === "Current" ? "emerald" : "amber"}
                          size="sm"
                          dot
                        >
                          {c.status}
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
              icon={WalletCards}
              title="No customer receivables yet"
              text="Add your first customer receivable to monitor overdue aging and protect your cash buffer."
              action="Add Receivable"
              onClick={() => setShowAdd(true)}
            />
          </div>
        )}
      </div>

      {showAdd && (
        <RecordModal
          kind="receivable"
          onClose={() => setShowAdd(false)}
          onRecordSaved={onRefresh}
        />
      )}
    </div>
  );
}
