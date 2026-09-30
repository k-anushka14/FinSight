import { useState } from "react";
import { MessageSquare, Send, Sparkles } from "lucide-react";
import {
  calculateFinancials,
  compact,
  type BusinessBootstrap,
} from "@/lib/financials";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "../components/ui/Badge";

interface CopilotPageProps {
  data: BusinessBootstrap;
}

const copilotQuestions = [
  "Why did expenses increase?",
  "Which vendor costs the most?",
  "What payments are due soon?",
  "How healthy is my cash flow?",
  "What should I review?",
];

export function CopilotPage({ data }: CopilotPageProps) {
  const f = calculateFinancials(data);
  const [selectedQuestion, setSelectedQuestion] = useState(copilotQuestions[0]);
  const [customInput, setCustomInput] = useState("");

  const answers: Record<string, { answer: string; sources: string[] }> = {
    "Why did expenses increase?": {
      answer: f.populated
        ? `Your recorded operational expenses total ${compact(f.expenseTotal)} across ${
            data.transactions.filter((item) => item.type === "expense").length
          } transactions. ${
            f.categories[0]
              ? `${f.categories[0].name} is currently your highest spend category representing ${compact(
                  f.categories[0].value,
                )}.`
              : "Categorize further entries to identify granular cost trends."
          }`
        : "Insufficient historical records. Log transactions across consecutive periods to evaluate spend velocity.",
      sources: ["Ledger Transactions", "Expense Analytics", "Category Breakdown"],
    },
    "Which vendor costs the most?": {
      answer: f.vendorSpend[0]
        ? `${f.vendorSpend[0].name} is your highest-volume supplier at ${compact(
            f.vendorSpend[0].spend,
          )} across recent payments.`
        : "No vendor-linked expenses recorded yet. Assign vendors to transactions to track supplier concentration.",
      sources: ["Vendor Spend Registry", "Disbursement Records"],
    },
    "What payments are due soon?": {
      answer: data.payables.length
        ? `${compact(
            data.payables.reduce((sum, item) => sum + item.amount, 0),
          )} is currently scheduled across ${data.payables.length} open payable obligation(s).`
        : "No supplier payables are currently due or recorded in the schedule.",
      sources: ["Payables Queue", "Cash Flow Forecast"],
    },
    "How healthy is my cash flow?": {
      answer: f.populated
        ? `Your current net cash flow is ${compact(f.netCashFlow)} and liquid cash reserves stand at ${compact(
            f.currentCash,
          )}. Overall financial health score is rated ${f.score}/100.`
        : "Log initial revenue and expense transactions to calibrate your live financial health score.",
      sources: ["Financial Health Engine", "Working Capital Metrics"],
    },
    "What should I review?": {
      answer: data.receivables.length
        ? `Review your ${data.receivables.length} outstanding customer receivable(s) totaling ${compact(
            f.receivables,
          )} first, then reconcile upcoming supplier payables.`
        : "Log your first sales invoice and customer balance to surface high-priority receivables.",
      sources: ["Action Center", "Receivables Aging", "Workspace Coverage"],
    },
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    // Map to the closest question or use a smart response
    const query = customInput.toLowerCase();
    if (query.includes("vendor") || query.includes("supplier")) {
      setSelectedQuestion("Which vendor costs the most?");
    } else if (query.includes("expense") || query.includes("cost") || query.includes("spend")) {
      setSelectedQuestion("Why did expenses increase?");
    } else if (query.includes("due") || query.includes("payable") || query.includes("bill")) {
      setSelectedQuestion("What payments are due soon?");
    } else if (query.includes("cash") || query.includes("health") || query.includes("score")) {
      setSelectedQuestion("How healthy is my cash flow?");
    } else {
      setSelectedQuestion("What should I review?");
    }
    setCustomInput("");
  };

  const response = answers[selectedQuestion] || answers["What should I review?"];

  return (
    <div className="space-y-6 animate-rise">
      <PageHeader
        kicker="Conversational Financial Intelligence"
        title="Business Copilot"
        description="Ask natural-language questions about your cash position, vendor obligations, spend spikes, and margin risks."
      />

      <div className="mx-auto max-w-4xl space-y-6">
        {/* Main Copilot Interactive Console */}
        <div className="glass-card rounded-2xl overflow-hidden card-hover-effect border border-white/[0.08]">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#111722] via-[#141C28] to-[#111722] p-6 sm:p-8 border-b border-white/[0.06]">
            <div className="flex items-start gap-4">
              <div className="relative grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-black shadow-lg shadow-emerald-500/20">
                <Sparkles size={24} />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-400 glow-dot-emerald animate-pulse" />
                  AI Financial Assistant
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white mt-1">
                  What would you like to understand?
                </h2>
                <p className="mt-1 text-xs text-zinc-400">
                  Select a prompt below or type your inquiry to synthesize an instant financial assessment.
                </p>
              </div>
            </div>

            {/* Questions Pills */}
            <div className="mt-6 flex flex-wrap gap-2">
              {copilotQuestions.map((q) => {
                const active = selectedQuestion === q;
                return (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setSelectedQuestion(q)}
                    className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-150 ${
                      active
                        ? "bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20 scale-[1.02]"
                        : "bg-white/[0.04] text-zinc-300 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white"
                    }`}
                  >
                    {q}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Response Section */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-emerald-400" />
              <h3 className="font-display text-base font-bold text-white">
                {selectedQuestion}
              </h3>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
              <p className="text-sm sm:text-base leading-relaxed text-zinc-200 font-sans">
                {response.answer}
              </p>
            </div>

            {/* Grounded Sources */}
            <div className="pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Sources:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {response.sources.map((src) => (
                    <Badge key={src} tone="cyan" size="sm">
                      {src}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-zinc-400 font-mono">
                100% Grounded in Live Business Records
              </div>
            </div>
          </div>

          {/* Custom Question Form */}
          <div className="border-t border-white/[0.08] bg-[#070A0F]/80 p-4">
            <form onSubmit={handleCustomSubmit} className="flex gap-2">
              <input
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Ask about spending, cash runway, vendors, or overdue bills..."
                className="form-input flex-1 text-xs"
              />
              <button
                type="submit"
                className="btn-primary rounded-xl px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <span>Ask</span>
                <Send size={13} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
