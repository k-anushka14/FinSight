import { useState } from "react";
import { BriefcaseBusiness, FileCheck2, IndianRupee, Plus } from "lucide-react";
import {
  calculateFinancials,
  compact,
  type BusinessBootstrap,
} from "@/lib/financials";
import { PageHeader } from "../components/ui/PageHeader";
import { StatCard } from "../components/ui/StatCard";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";
import { RecordModal } from "../components/modals/RecordModal";

interface VendorsPageProps {
  data: BusinessBootstrap;
  onRefresh: () => void;
}

export function VendorsPage({ data, onRefresh }: VendorsPageProps) {
  const [showAdd, setShowAdd] = useState(false);
  const spends = calculateFinancials(data).vendorSpend;
  const totalSpend = spends.reduce((sum, item) => sum + item.spend, 0);

  return (
    <div className="space-y-6 animate-rise">
      <PageHeader
        kicker="Supplier Economics"
        title="Vendor Directory"
        description="Connect your supplier directory directly with transaction data, procurement categories, and payment terms."
        action={
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="btn-primary inline-flex h-10 items-center gap-1.5 rounded-xl px-4 text-xs font-semibold"
          >
            <Plus size={15} />
            <span>Add Vendor</span>
          </button>
        }
      />

      {/* 3 Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Active Vendors"
          value={String(data.vendors.length)}
          delta="Registered Suppliers"
          icon={BriefcaseBusiness}
          tone="blue"
        />
        <StatCard
          label="Tracked Supplier Spend"
          value={compact(totalSpend)}
          delta="Linked Outflows"
          icon={IndianRupee}
          tone="emerald"
        />
        <StatCard
          label="Invoices Captured"
          value={String(data.invoices.length)}
          delta="Processed OCR"
          icon={FileCheck2}
          tone="amber"
        />
      </div>

      {/* Vendors Table */}
      <div className="glass-card rounded-2xl overflow-hidden card-hover-effect">
        <div className="border-b border-white/[0.06] p-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400">
            Supplier Registry
          </div>
          <h2 className="font-display text-base font-bold text-white">
            Suppliers & Commercial Terms
          </h2>
        </div>

        {data.vendors.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-xs">
              <thead className="border-b border-white/[0.06] bg-white/[0.02] text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                <tr>
                  <th className="px-5 py-3.5">Vendor Name</th>
                  <th className="px-5 py-3.5">Procurement Category</th>
                  <th className="px-5 py-3.5 text-right">Historical Spend</th>
                  <th className="px-5 py-3.5 text-center">Credit Terms</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {data.vendors.map((v) => {
                  const spend =
                    spends.find((item) => item.name === v.name)?.spend ?? 0;
                  return (
                    <tr
                      key={v.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="grid size-9 place-items-center rounded-xl border border-white/[0.08] bg-[#161F2E] text-xs font-bold text-emerald-400">
                            {v.name.slice(0, 2).toUpperCase()}
                          </span>
                          <span className="font-semibold text-white">
                            {v.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Badge tone="neutral" size="sm">
                          {v.category}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-right font-mono font-bold text-white">
                        {compact(spend)}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <Badge tone="blue" size="sm">
                          {v.terms || "Standard"}
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
              icon={BriefcaseBusiness}
              title="No vendors added yet"
              text="Add your primary suppliers to automatically link transaction items to procurement history."
              action="Add Vendor"
              onClick={() => setShowAdd(true)}
            />
          </div>
        )}
      </div>

      {showAdd && (
        <RecordModal
          kind="vendor"
          onClose={() => setShowAdd(false)}
          onRecordSaved={onRefresh}
        />
      )}
    </div>
  );
}
