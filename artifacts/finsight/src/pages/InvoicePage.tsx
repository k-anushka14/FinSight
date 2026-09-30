import { useState } from "react";
import { toast } from "sonner";
import { Check, CloudUpload, FileCheck2, Sparkles } from "lucide-react";
import { inr } from "@/lib/financials";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "../components/ui/Badge";
import { useCreateInvoice } from "@workspace/api-client-react";

interface InvoicePageProps {
  onRefresh: () => void;
}

const invoiceSampleVendors = [
  {
    vendor: "Pioneer Paper Mills",
    category: "Raw materials",
    subtotal: 218000,
  },
  {
    vendor: "Morya Logistics",
    category: "Transport & logistics",
    subtotal: 46200,
  },
  {
    vendor: "Kaveri Polymers",
    category: "Raw materials",
    subtotal: 115500,
  },
];

export function InvoicePage({ onRefresh }: InvoicePageProps) {
  const mutation = useCreateInvoice();
  const [file, setFile] = useState(false);
  const [saved, setSaved] = useState(false);
  const [extracted, setExtracted] = useState<{
    vendor: string;
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
    subtotal: number;
    gst: number;
    category: string;
  } | null>(null);

  const chooseFile = () => {
    setFile(true);
    setSaved(false);
    const sample =
      invoiceSampleVendors[
        Math.floor(Math.random() * invoiceSampleVendors.length)
      ];
    const invoiceDate = new Date().toISOString().slice(0, 10);
    const due = new Date();
    due.setDate(due.getDate() + 30);
    setExtracted({
      vendor: sample.vendor,
      invoiceNumber: `INV-${Date.now().toString().slice(-5)}`,
      invoiceDate,
      dueDate: due.toISOString().slice(0, 10),
      subtotal: sample.subtotal,
      gst: Math.round(sample.subtotal * 0.18),
      category: sample.category,
    });
  };

  const updateField = <K extends keyof NonNullable<typeof extracted>>(
    key: K,
    value: NonNullable<typeof extracted>[K],
  ) =>
    setExtracted((current) =>
      current ? { ...current, [key]: value } : current,
    );

  const total = extracted ? extracted.subtotal + extracted.gst : 0;

  const save = () => {
    if (!extracted) return;
    mutation.mutate(
      {
        data: {
          vendor: extracted.vendor,
          invoiceNumber: extracted.invoiceNumber,
          invoiceDate: extracted.invoiceDate,
          dueDate: extracted.dueDate,
          subtotal: extracted.subtotal,
          gst: extracted.gst,
          total,
          category: extracted.category,
          status: "Reviewed",
        },
      },
      {
        onSuccess: () => {
          onRefresh();
          setSaved(true);
          toast.success("Invoice successfully processed and saved!");
        },
        onError: () => toast.error("Could not save invoice"),
      },
    );
  };

  return (
    <div className="space-y-6 animate-rise">
      <PageHeader
        kicker="Automated OCR"
        title="Invoice Intelligence"
        description="Drop in raw supplier invoices, bills, or receipts. FinSight extracts the line items, GST breakdown, and payment due dates into verified accounting records."
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        {/* Step 1: Upload Card */}
        <div className="glass-card rounded-2xl p-6 card-hover-effect flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400">
                Step 1
              </div>
              <h2 className="font-display text-lg font-bold text-white">
                Upload Document
              </h2>
              <p className="mt-1 text-xs text-zinc-400">
                Supports PDF, JPG, PNG up to 15 MB
              </p>
            </div>

            <label
              className={`flex min-h-[250px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
                file
                  ? "border-emerald-500/50 bg-emerald-500/5"
                  : "border-white/[0.1] bg-white/[0.02] hover:border-emerald-500/30 hover:bg-white/[0.04]"
              }`}
            >
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={chooseFile}
              />
              <div className="grid size-14 place-items-center rounded-2xl border border-white/[0.08] bg-[#161F2E] text-emerald-400 shadow-xl shadow-black/50">
                <CloudUpload size={26} />
              </div>
              <div className="mt-4 text-sm font-semibold text-white">
                {file ? "Invoice Document Attached" : "Choose a File or Drag Here"}
              </div>
              <div className="mt-1 text-xs text-zinc-400">
                {file
                  ? "Click to simulate another sample document"
                  : "AI extractor ready to parse fields"}
              </div>
            </label>
          </div>

          <button
            type="button"
            disabled={!file}
            onClick={() => {
              chooseFile();
              toast.success("New invoice document scanned and parsed");
            }}
            className="btn-primary mt-6 w-full rounded-xl py-3 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40"
          >
            {file ? "Rescan Document" : "Select Sample Document"}
          </button>
        </div>

        {/* Step 2: Extracted Details Card */}
        <div className="glass-card rounded-2xl p-6 card-hover-effect">
          <div className="mb-5 flex items-center justify-between border-b border-white/[0.06] pb-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-400">
                Step 2
              </div>
              <h2 className="font-display text-lg font-bold text-white">
                Review Extracted Fields
              </h2>
            </div>
            {file && (
              <Badge tone="emerald" dot>
                98% OCR Confidence
              </Badge>
            )}
          </div>

          {file && extracted ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-xs font-semibold text-zinc-300">
                  <span className="mb-1 block">Vendor Name</span>
                  <input
                    className="form-input text-xs"
                    value={extracted.vendor}
                    onChange={(e) => updateField("vendor", e.target.value)}
                  />
                </label>

                <label className="block text-xs font-semibold text-zinc-300">
                  <span className="mb-1 block">Invoice #</span>
                  <input
                    className="form-input font-mono text-xs"
                    value={extracted.invoiceNumber}
                    onChange={(e) => updateField("invoiceNumber", e.target.value)}
                  />
                </label>

                <label className="block text-xs font-semibold text-zinc-300">
                  <span className="mb-1 block">Invoice Date</span>
                  <input
                    type="date"
                    className="form-input text-xs"
                    value={extracted.invoiceDate}
                    onChange={(e) => updateField("invoiceDate", e.target.value)}
                  />
                </label>

                <label className="block text-xs font-semibold text-zinc-300">
                  <span className="mb-1 block">Due Date</span>
                  <input
                    type="date"
                    className="form-input text-xs"
                    value={extracted.dueDate}
                    onChange={(e) => updateField("dueDate", e.target.value)}
                  />
                </label>
              </div>

              <label className="block text-xs font-semibold text-zinc-300">
                <span className="mb-1 block">Category Classification</span>
                <select
                  className="form-input text-xs"
                  value={extracted.category}
                  onChange={(e) => updateField("category", e.target.value)}
                >
                  <option value="Raw materials" className="bg-[#111722] text-white">Raw materials</option>
                  <option value="Transport & logistics" className="bg-[#111722] text-white">Transport & logistics</option>
                  <option value="Labour & wages" className="bg-[#111722] text-white">Labour & wages</option>
                  <option value="Utilities & overheads" className="bg-[#111722] text-white">Utilities & overheads</option>
                  <option value="Other overheads" className="bg-[#111722] text-white">Other overheads</option>
                </select>
              </label>

              {/* Totals Breakdown Box */}
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Taxable Subtotal</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-zinc-500">₹</span>
                    <input
                      type="number"
                      className="form-input h-8 w-32 text-right font-mono"
                      value={extracted.subtotal}
                      onChange={(e) =>
                        updateField("subtotal", Number(e.target.value) || 0)
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">GST (18% Incurred)</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-zinc-500">₹</span>
                    <input
                      type="number"
                      className="form-input h-8 w-32 text-right font-mono"
                      value={extracted.gst}
                      onChange={(e) =>
                        updateField("gst", Number(e.target.value) || 0)
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/[0.06] pt-3 text-sm font-bold text-white">
                  <span>Grand Total</span>
                  <span className="font-mono text-emerald-400">{inr(total)}</span>
                </div>
              </div>

              {saved && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-400 flex items-center gap-2">
                  <Check size={14} />
                  <span>Invoice successfully posted to your business ledger!</span>
                </div>
              )}

              <button
                type="button"
                onClick={save}
                disabled={mutation.isPending || saved}
                className="btn-primary w-full rounded-xl py-3 text-xs font-semibold disabled:opacity-50"
              >
                {saved
                  ? "Saved to Ledger"
                  : mutation.isPending
                  ? "Saving to Database..."
                  : "Confirm & Commit Invoice"}
              </button>
            </div>
          ) : (
            <div className="grid min-h-[300px] place-items-center rounded-2xl border border-white/[0.06] bg-white/[0.02] text-center p-6">
              <div>
                <FileCheck2 size={36} className="mx-auto text-zinc-600 mb-3" />
                <p className="text-sm font-semibold text-white">
                  Extraction Preview Ready
                </p>
                <p className="mt-1 text-xs text-zinc-400 max-w-xs">
                  Upload an invoice or receipt to automatically populate vendor, subtotal, and tax lines.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
