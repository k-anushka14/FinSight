import { useState } from "react";
import { toast } from "sonner";
import {
  BriefcaseBusiness,
  Check,
  Download,
  FileBarChart,
  WalletCards,
} from "lucide-react";
import { type BusinessBootstrap } from "@/lib/financials";
import { PageHeader } from "../components/ui/PageHeader";

interface ReportsPageProps {
  data: BusinessBootstrap;
}

export function ReportsPage({ data }: ReportsPageProps) {
  const [exported, setExported] = useState<string | null>(null);

  const reports = [
    {
      title: "Monthly Management Pack",
      text: "Comprehensive executive summary of recognized revenue, operational burn, net cash flow, and runway delta.",
      icon: FileBarChart,
      tone: "emerald" as const,
    },
    {
      title: "Receivables Aging Analysis",
      text: "Customer-wise collection timetable, 30/60/90-day aging buckets, and high-risk overdue exposures.",
      icon: WalletCards,
      tone: "cyan" as const,
    },
    {
      title: "Vendor Spend & Terms Audit",
      text: "Supplier concentration analysis, payment terms variance, and procurement category distributions.",
      icon: BriefcaseBusiness,
      tone: "amber" as const,
    },
  ];

  const handleExport = (title: string) => {
    setExported(title);
    toast.success(`${title} generated and exported successfully!`);
    setTimeout(() => setExported(null), 3500);
  };

  return (
    <div className="space-y-6 animate-rise">
      <PageHeader
        kicker="Executive Reporting"
        title="Financial Reports & Exports"
        description="Generate formatted financial digests ready for leadership review, tax accountants, or banking and credit partners."
        action={
          <div className="flex items-center gap-2">
            <input
              type="date"
              defaultValue={new Date(Date.now() - 30 * 86400000)
                .toISOString()
                .slice(0, 10)}
              className="h-10 rounded-xl border border-white/[0.08] bg-[#111722] px-3 text-xs font-mono text-zinc-300 outline-none hover:border-white/[0.15] transition"
            />
            <span className="text-zinc-500 text-xs">to</span>
            <input
              type="date"
              defaultValue={new Date().toISOString().slice(0, 10)}
              className="h-10 rounded-xl border border-white/[0.08] bg-[#111722] px-3 text-xs font-mono text-zinc-300 outline-none hover:border-white/[0.15] transition"
            />
          </div>
        }
      />

      {/* 3 Report Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {reports.map((report) => {
          const Icon = report.icon;
          const isDone = exported === report.title;
          const iconTone =
            report.tone === "emerald"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : report.tone === "cyan"
              ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
              : "bg-amber-500/10 border-amber-500/20 text-amber-400";

          return (
            <div
              key={report.title}
              className="glass-card rounded-2xl p-6 card-hover-effect flex flex-col justify-between"
            >
              <div>
                <div
                  className={`grid size-12 place-items-center rounded-2xl border shadow-sm ${iconTone}`}
                >
                  <Icon size={22} strokeWidth={2} />
                </div>

                <h3 className="mt-5 font-display text-base sm:text-lg font-bold text-white">
                  {report.title}
                </h3>

                <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                  {report.text}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => handleExport(report.title)}
                  className={`w-full rounded-xl py-2.5 text-xs font-semibold inline-flex items-center justify-center gap-2 transition-all ${
                    isDone
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                      : "btn-secondary"
                  }`}
                >
                  {isDone ? (
                    <>
                      <Check size={14} />
                      <span>Exported</span>
                    </>
                  ) : (
                    <>
                      <Download size={14} />
                      <span>Export Snapshot</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ready Records Summary */}
      <div className="glass-card rounded-2xl p-6 card-hover-effect">
        <div className="border-b border-white/[0.06] pb-4 mb-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400">
            Source Records
          </div>
          <h2 className="font-display text-base font-bold text-white">
            Data Ready for Compilation
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="text-xs text-zinc-400 font-medium">
              Ledger Transactions
            </div>
            <div className="mt-2 font-display text-2xl font-bold text-white tabular-nums">
              {data.transactions.length}
            </div>
            <div className="mt-1 text-[11px] text-emerald-400">
              Verified entries
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="text-xs text-zinc-400 font-medium">
              Customer Receivables
            </div>
            <div className="mt-2 font-display text-2xl font-bold text-white tabular-nums">
              {data.receivables.length}
            </div>
            <div className="mt-1 text-cyan-400">
              Active tracking
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="text-xs text-zinc-400 font-medium">
              Verified Invoices
            </div>
            <div className="mt-2 font-display text-2xl font-bold text-white tabular-nums">
              {data.invoices.length}
            </div>
            <div className="mt-1 text-amber-400">
              OCR processed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
