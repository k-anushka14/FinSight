import { useState } from "react";
import { toast } from "sonner";
import { Filter, MessageCircle, Plus, ReceiptIndianRupee, Search } from "lucide-react";
import { compact, formatDate, inr, type BusinessBootstrap } from "@/lib/financials";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";
import { RecordModal, categories } from "../components/modals/RecordModal";

interface TransactionsPageProps {
  data: BusinessBootstrap;
  onRefresh: () => void;
}

export function TransactionsPage({ data, onRefresh }: TransactionsPageProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [showAdd, setShowAdd] = useState(false);

  const filtered = data.transactions.filter(
    (t) =>
      t.type === "expense" &&
      `${t.description} ${t.vendor ?? ""}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (category === "All categories" || t.category === category),
  );

  const totalExpense = filtered.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6 animate-rise">
      <PageHeader
        kicker="Money in Motion"
        title="Expense Ledger"
        description="A real-time ledger of every outgoing rupee, ready to search, filter, and analyze against operational budgets."
        action={
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="btn-primary inline-flex h-10 items-center gap-1.5 rounded-xl px-4 text-xs font-semibold"
          >
            <Plus size={15} />
            <span>Add Expense</span>
          </button>
        }
      />

      {/* Main Table Card */}
      <div className="glass-card rounded-2xl overflow-hidden card-hover-effect">
        {/* Filters Bar */}
        <div className="flex flex-col gap-3 border-b border-white/[0.06] p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by vendor, description, or reference..."
              aria-label="Search transactions"
              className="form-input pl-10 text-xs"
            />
          </div>

          <div className="flex items-center gap-2.5">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Filter category"
              className="h-10 rounded-xl border border-white/[0.08] bg-[#111722] px-3.5 text-xs font-semibold text-zinc-300 outline-none hover:border-white/[0.15] transition"
            >
              <option value="All categories" className="bg-[#111722] text-white">
                All categories
              </option>
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[#111722] text-white">
                  {c}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() =>
                toast.info("Use the search bar and category dropdown to filter transactions")
              }
              className="btn-secondary flex h-10 items-center justify-center gap-2 rounded-xl px-3.5 text-xs font-semibold"
            >
              <Filter size={14} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* Ledger Summary Stats */}
        <div className="flex items-center justify-between px-5 py-3 bg-white/[0.01] border-b border-white/[0.04] text-xs text-zinc-400">
          <div>
            Showing <span className="font-semibold text-white">{filtered.length}</span> transaction{filtered.length !== 1 ? "s" : ""}
          </div>
          <div>
            Filtered Total: <span className="font-mono font-bold text-amber-400">{compact(totalExpense)}</span>
          </div>
        </div>

        {/* Table Content */}
        {filtered.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-xs">
              <thead className="border-b border-white/[0.06] bg-white/[0.02] text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                <tr>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">Description & Reference</th>
                  <th className="px-5 py-3.5">Vendor</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5 text-right">Amount</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-4 font-mono text-zinc-400">
                      {formatDate(t.date)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">
                        {t.description}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                        <span>TX-{t.id}</span>
                        {t.source === "whatsapp" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/20">
                            <MessageCircle size={10} />
                            WhatsApp
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-zinc-300">
                      {t.vendor || <span className="text-zinc-600">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      <Badge tone="neutral" size="sm">
                        {t.category}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-right font-mono font-bold text-white">
                      {inr(t.amount)}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <Badge
                        tone={t.status === "Cleared" ? "emerald" : "amber"}
                        size="sm"
                        dot
                      >
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
              icon={ReceiptIndianRupee}
              title="No transactions matching filter"
              text="Add your first expense or clear search filters to view the full ledger."
              action="Add Expense"
              onClick={() => setShowAdd(true)}
            />
          </div>
        )}
      </div>

      {showAdd && (
        <RecordModal
          kind="expense"
          onClose={() => setShowAdd(false)}
          onRecordSaved={onRefresh}
        />
      )}
    </div>
  );
}
