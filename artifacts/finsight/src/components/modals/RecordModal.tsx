import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { Volume2 } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";
import { FIELD_HELP, FORM_HELP, speak, speechSupported } from "../../lib/i18n";
import { Modal } from "../ui/Modal";
import {
  useCreateBudget,
  useCreateCustomer,
  useCreatePayable,
  useCreateReceivable,
  useCreateRecurringExpense,
  useCreateRevenue,
  useCreateTransaction,
  useCreateVendor,
} from "@workspace/api-client-react";

export type RecordKind =
  | "expense"
  | "revenue"
  | "customer"
  | "vendor"
  | "receivable"
  | "payable"
  | "budget"
  | "recurring";

export const categories = [
  "Raw materials",
  "Labour & wages",
  "Transport & logistics",
  "Utilities",
  "Other overheads",
];

function ModalField({
  label,
  children,
  helpKey,
}: {
  label: string;
  children: ReactNode;
  helpKey?: keyof typeof FIELD_HELP;
}) {
  const { lang } = useLanguage();
  return (
    <label className="block text-xs font-semibold text-zinc-300">
      <span className="inline-flex items-center gap-1.5 mb-1.5">
        {label}
        {helpKey && speechSupported() && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              speak(FIELD_HELP[helpKey][lang], lang);
            }}
            aria-label={`Listen to help for ${label}`}
            className="grid size-5 place-items-center rounded-full text-zinc-500 hover:bg-white/[0.08] hover:text-emerald-400 transition"
          >
            <Volume2 size={13} />
          </button>
        )}
      </span>
      <div>{children}</div>
    </label>
  );
}

export function RecordModal({
  kind,
  onClose,
  onRecordSaved,
}: {
  kind: RecordKind;
  onClose: () => void;
  onRecordSaved: () => void;
}) {
  const { lang } = useLanguage();
  const expense = useCreateTransaction();
  const revenue = useCreateRevenue();
  const customer = useCreateCustomer();
  const vendor = useCreateVendor();
  const receivable = useCreateReceivable();
  const payable = useCreatePayable();
  const budget = useCreateBudget();
  const recurring = useCreateRecurringExpense();

  const [form, setForm] = useState<Record<string, string>>({
    description: "",
    amount: "",
    category: "Raw materials",
    vendor: "",
    customer: "",
    date: new Date().toISOString().slice(0, 10),
    status: "Cleared",
    name: "",
    email: "",
    phone: "",
    terms: "Net 30",
    invoice: "",
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    priority: "Medium",
    reference: "",
    period: new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(new Date()),
    frequency: "Monthly",
  });

  const titleMap: Record<RecordKind, { title: string; subtitle: string }> = {
    expense: {
      title: "Record Business Expense",
      subtitle: "Log an outgoing expenditure against a category to track operational burn.",
    },
    revenue: {
      title: "Record Customer Revenue",
      subtitle: "Capture cash or account inflow from customer sales.",
    },
    customer: {
      title: "Add New Customer",
      subtitle: "Create customer profile for invoicing, tracking, and aging analysis.",
    },
    vendor: {
      title: "Add Supplier / Vendor",
      subtitle: "Register vendor payment terms and procurement category.",
    },
    receivable: {
      title: "Add Pending Receivable",
      subtitle: "Track an outstanding customer payment due to maintain working capital.",
    },
    payable: {
      title: "Add Supplier Payable",
      subtitle: "Schedule upcoming bills to protect payment terms and credit score.",
    },
    budget: {
      title: "Configure Category Budget",
      subtitle: "Set monthly operational expenditure cap for real-time overspend alerts.",
    },
    recurring: {
      title: "Add Recurring Obligation",
      subtitle: "Automate fixed recurring outflows like rent, payroll, and utilities.",
    },
  };

  const { title, subtitle } = titleMap[kind];

  const update = (key: string, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const onSuccess = () => {
    onRecordSaved();
    toast.success(`${title} recorded successfully!`);
    onClose();
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const done = {
      onSuccess,
      onError: () => toast.error("Could not save this record"),
    };

    if (kind === "expense")
      expense.mutate(
        {
          data: {
            description: form.description,
            amount: Number(form.amount),
            category: form.category,
            vendor: form.vendor || null,
            date: form.date,
            status: form.status,
          },
        },
        done,
      );

    if (kind === "revenue")
      revenue.mutate(
        {
          data: {
            description: form.description,
            amount: Number(form.amount),
            customer: form.customer || null,
            date: form.date,
            status: form.status,
          },
        },
        done,
      );

    if (kind === "customer")
      customer.mutate(
        {
          data: {
            name: form.name,
            email: form.email || null,
            phone: form.phone || null,
          },
        },
        done,
      );

    if (kind === "vendor")
      vendor.mutate(
        {
          data: { name: form.name, category: form.category, terms: form.terms },
        },
        done,
      );

    if (kind === "receivable")
      receivable.mutate(
        {
          data: {
            customer: form.customer,
            invoice: form.invoice,
            amount: Number(form.amount),
            dueDate: form.dueDate,
            status: form.status,
          },
        },
        done,
      );

    if (kind === "payable")
      payable.mutate(
        {
          data: {
            vendor: form.vendor,
            reference: form.reference,
            amount: Number(form.amount),
            dueDate: form.dueDate,
            priority: form.priority,
            status: "Open",
          },
        },
        done,
      );

    if (kind === "budget")
      budget.mutate(
        {
          data: {
            category: form.category,
            amount: Number(form.amount),
            period: form.period,
          },
        },
        done,
      );

    if (kind === "recurring")
      recurring.mutate(
        {
          data: {
            name: form.name,
            amount: Number(form.amount),
            category: form.category,
            frequency: form.frequency,
          },
        },
        done,
      );
  };

  const busy =
    expense.isPending ||
    revenue.isPending ||
    customer.isPending ||
    vendor.isPending ||
    receivable.isPending ||
    payable.isPending ||
    budget.isPending ||
    recurring.isPending;

  return (
    <Modal
      title={title}
      subtitle={subtitle}
      onClose={onClose}
      onListen={
        speechSupported() && FORM_HELP[kind]
          ? () => speak(FORM_HELP[kind][lang], lang)
          : undefined
      }
    >
      <form onSubmit={submit} className="space-y-4">
        {(kind === "expense" || kind === "revenue") && (
          <>
            <ModalField
              label="Description"
              helpKey={kind === "expense" ? "entryDescriptionExpense" : "entryDescriptionRevenue"}
            >
              <input
                required
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder={
                  kind === "expense"
                    ? "e.g. Raw material batch #892"
                    : "e.g. Customer advance #1048"
                }
                className="form-input"
              />
            </ModalField>

            <div className="grid grid-cols-2 gap-3">
              <ModalField
                label="Amount (₹)"
                helpKey={kind === "expense" ? "entryAmountExpense" : "entryAmountRevenue"}
              >
                <input
                  required
                  min="0"
                  type="number"
                  placeholder="0"
                  value={form.amount}
                  onChange={(e) => update("amount", e.target.value)}
                  className="form-input font-mono"
                />
              </ModalField>

              <ModalField
                label="Date"
                helpKey={kind === "expense" ? "entryDateExpense" : "entryDateRevenue"}
              >
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={(e) => update("date", e.target.value)}
                  className="form-input"
                />
              </ModalField>
            </div>

            {kind === "expense" ? (
              <>
                <ModalField label="Cost Category">
                  <select
                    value={form.category}
                    onChange={(e) => update("category", e.target.value)}
                    className="form-input"
                  >
                    {categories.map((item) => (
                      <option key={item} value={item} className="bg-[#111722] text-white">
                        {item}
                      </option>
                    ))}
                  </select>
                </ModalField>

                <ModalField label="Vendor / Supplier (Optional)">
                  <input
                    value={form.vendor}
                    onChange={(e) => update("vendor", e.target.value)}
                    placeholder="e.g. Apex Packaging Mills"
                    className="form-input"
                  />
                </ModalField>
              </>
            ) : (
              <ModalField label="Customer / Client (Optional)">
                <input
                  value={form.customer}
                  onChange={(e) => update("customer", e.target.value)}
                  placeholder="e.g. Reliance Retail"
                  className="form-input"
                />
              </ModalField>
            )}
          </>
        )}

        {kind === "customer" && (
          <div className="space-y-4">
            <ModalField label="Customer Name">
              <input
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Metro Supermarkets"
                className="form-input"
              />
            </ModalField>
            <div className="grid grid-cols-2 gap-3">
              <ModalField label="Email Address">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="billing@customer.com"
                  className="form-input"
                />
              </ModalField>
              <ModalField label="Phone / WhatsApp">
                <input
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                  className="form-input"
                />
              </ModalField>
            </div>
          </div>
        )}

        {kind === "vendor" && (
          <div className="space-y-4">
            <ModalField label="Vendor Name">
              <input
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Tata Steel Processing"
                className="form-input"
              />
            </ModalField>
            <div className="grid grid-cols-2 gap-3">
              <ModalField label="Category">
                <select
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                  className="form-input"
                >
                  {categories.map((item) => (
                    <option key={item} value={item} className="bg-[#111722] text-white">
                      {item}
                    </option>
                  ))}
                </select>
              </ModalField>
              <ModalField label="Payment Terms">
                <input
                  value={form.terms}
                  onChange={(e) => update("terms", e.target.value)}
                  placeholder="Net 30, Due on Receipt"
                  className="form-input"
                />
              </ModalField>
            </div>
          </div>
        )}

        {kind === "receivable" && (
          <div className="space-y-4">
            <ModalField label="Customer Name">
              <input
                required
                value={form.customer}
                onChange={(e) => update("customer", e.target.value)}
                placeholder="e.g. Apex Industries"
                className="form-input"
              />
            </ModalField>
            <div className="grid grid-cols-2 gap-3">
              <ModalField label="Invoice Number">
                <input
                  required
                  value={form.invoice}
                  onChange={(e) => update("invoice", e.target.value)}
                  placeholder="INV-2025-001"
                  className="form-input font-mono"
                />
              </ModalField>
              <ModalField label="Receivable Amount (₹)">
                <input
                  required
                  min="0"
                  type="number"
                  value={form.amount}
                  onChange={(e) => update("amount", e.target.value)}
                  className="form-input font-mono"
                />
              </ModalField>
            </div>
            <ModalField label="Due Date">
              <input
                required
                type="date"
                value={form.dueDate}
                onChange={(e) => update("dueDate", e.target.value)}
                className="form-input"
              />
            </ModalField>
          </div>
        )}

        {kind === "payable" && (
          <div className="space-y-4">
            <ModalField label="Vendor / Supplier">
              <input
                required
                value={form.vendor}
                onChange={(e) => update("vendor", e.target.value)}
                placeholder="e.g. Raw Material Co."
                className="form-input"
              />
            </ModalField>
            <div className="grid grid-cols-2 gap-3">
              <ModalField label="Bill Reference #">
                <input
                  required
                  value={form.reference}
                  onChange={(e) => update("reference", e.target.value)}
                  placeholder="BILL-9901"
                  className="form-input font-mono"
                />
              </ModalField>
              <ModalField label="Amount (₹)">
                <input
                  required
                  min="0"
                  type="number"
                  value={form.amount}
                  onChange={(e) => update("amount", e.target.value)}
                  className="form-input font-mono"
                />
              </ModalField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ModalField label="Due Date">
                <input
                  required
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => update("dueDate", e.target.value)}
                  className="form-input"
                />
              </ModalField>
              <ModalField label="Priority Level">
                <select
                  value={form.priority}
                  onChange={(e) => update("priority", e.target.value)}
                  className="form-input"
                >
                  <option value="High" className="bg-[#111722] text-white">High Priority</option>
                  <option value="Medium" className="bg-[#111722] text-white">Medium Priority</option>
                  <option value="Low" className="bg-[#111722] text-white">Low Priority</option>
                </select>
              </ModalField>
            </div>
          </div>
        )}

        {kind === "budget" && (
          <div className="space-y-4">
            <ModalField label="Expense Category">
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className="form-input"
              >
                {categories.map((item) => (
                  <option key={item} value={item} className="bg-[#111722] text-white">
                    {item}
                  </option>
                ))}
              </select>
            </ModalField>
            <div className="grid grid-cols-2 gap-3">
              <ModalField label="Monthly Budget Cap (₹)">
                <input
                  required
                  min="0"
                  type="number"
                  value={form.amount}
                  onChange={(e) => update("amount", e.target.value)}
                  className="form-input font-mono"
                />
              </ModalField>
              <ModalField label="Target Period">
                <input
                  value={form.period}
                  onChange={(e) => update("period", e.target.value)}
                  placeholder="e.g. March 2025"
                  className="form-input"
                />
              </ModalField>
            </div>
          </div>
        )}

        {kind === "recurring" && (
          <div className="space-y-4">
            <ModalField label="Expense Name / Description">
              <input
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Factory Facility Lease"
                className="form-input"
              />
            </ModalField>
            <div className="grid grid-cols-2 gap-3">
              <ModalField label="Recurring Amount (₹)">
                <input
                  required
                  min="0"
                  type="number"
                  value={form.amount}
                  onChange={(e) => update("amount", e.target.value)}
                  className="form-input font-mono"
                />
              </ModalField>
              <ModalField label="Billing Cadence">
                <select
                  value={form.frequency}
                  onChange={(e) => update("frequency", e.target.value)}
                  className="form-input"
                >
                  <option value="Monthly" className="bg-[#111722] text-white">Monthly</option>
                  <option value="Weekly" className="bg-[#111722] text-white">Weekly</option>
                  <option value="Quarterly" className="bg-[#111722] text-white">Quarterly</option>
                </select>
              </ModalField>
            </div>
            <ModalField label="Category Allocation">
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className="form-input"
              >
                {categories.map((item) => (
                  <option key={item} value={item} className="bg-[#111722] text-white">
                    {item}
                  </option>
                ))}
              </select>
            </ModalField>
          </div>
        )}

        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary rounded-xl px-4 py-2.5 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="btn-primary rounded-xl px-5 py-2.5 text-xs font-semibold disabled:opacity-50"
          >
            {busy ? "Saving Record..." : "Confirm & Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
