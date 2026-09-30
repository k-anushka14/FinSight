import { useState, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Activity, ArrowRight, Lightbulb, Sparkles } from "lucide-react";
import {
  getGetBusinessBootstrapQueryKey,
  useCreateBusiness,
  useLoadDemoBusiness,
} from "@workspace/api-client-react";
import { Badge } from "../components/ui/Badge";

export function SetupPage() {
  const [form, setForm] = useState({
    name: "",
    industry: "",
    location: "",
    currency: "INR",
    financialYear: "April – March",
    openingCash: "0",
    monthlyRevenueTarget: "0",
  });

  const create = useCreateBusiness();
  const demo = useLoadDemoBusiness();
  const client = useQueryClient();
  const [, setLocation] = useLocation();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    create.mutate(
      {
        data: {
          ...form,
          openingCash: Number(form.openingCash),
          monthlyRevenueTarget: Number(form.monthlyRevenueTarget),
        },
      },
      {
        onSuccess: () => {
          client.invalidateQueries({
            queryKey: getGetBusinessBootstrapQueryKey(),
          });
          toast.success("Business workspace created successfully!");
          setLocation("/dashboard");
        },
        onError: () => toast.error("Could not create the business workspace"),
      },
    );
  };

  const loadDemo = () =>
    demo.mutate(undefined, {
      onSuccess: () => {
        client.invalidateQueries({
          queryKey: getGetBusinessBootstrapQueryKey(),
        });
        toast.success("Demo business loaded successfully!");
        setLocation("/dashboard");
      },
      onError: () => toast.error("A business already exists for this account"),
    });

  const update = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  return (
    <div className="min-h-screen bg-[#080B12] text-zinc-100 font-sans px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Top Logo */}
        <Link href="/" className="flex items-center gap-3 w-fit group">
          <div className="relative grid size-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-black shadow-lg shadow-emerald-500/20">
            <Activity size={20} strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-bold text-white group-hover:text-emerald-300 transition">
            FinSight
          </span>
        </Link>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          {/* Left Instructions & Demo Loader */}
          <div className="space-y-6">
            <Badge tone="emerald" size="md">
              Workspace Setup
            </Badge>

            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Initialize Your Business Workspace
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Configure your primary entity profile. FinSight uses this to establish baseline currency, reporting period, and liquidity thresholds.
            </p>

            {/* Load Demo Business Box */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <Sparkles size={15} />
                <span>Instant Hackathon Demo</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Prefer to explore immediately with pre-loaded MSME data? Load <span className="font-bold text-white">Shree Packaging Solutions</span> to walk through transactions, What-if simulator, and live analytics.
              </p>
              <button
                type="button"
                onClick={loadDemo}
                disabled={demo.isPending}
                className="btn-primary w-full rounded-xl py-2.5 text-xs font-semibold disabled:opacity-50"
              >
                {demo.isPending ? "Loading Demo..." : "Load Demo Business"}
              </button>
            </div>
          </div>

          {/* Setup Form Card */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 card-hover-effect">
            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-semibold text-zinc-300">
                  <span className="mb-1.5 block">Business / Company Name</span>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="e.g. Shree Packaging Solutions"
                    className="form-input text-xs"
                  />
                </label>

                <label className="block text-xs font-semibold text-zinc-300">
                  <span className="mb-1.5 block">Industry / Sector</span>
                  <input
                    required
                    value={form.industry}
                    onChange={(e) => update("industry", e.target.value)}
                    placeholder="e.g. Manufacturing, Retail"
                    className="form-input text-xs"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-semibold text-zinc-300">
                  <span className="mb-1.5 block">City / Operating Hub</span>
                  <input
                    required
                    value={form.location}
                    onChange={(e) => update("location", e.target.value)}
                    placeholder="e.g. Pune, Maharashtra"
                    className="form-input text-xs"
                  />
                </label>

                <label className="block text-xs font-semibold text-zinc-300">
                  <span className="mb-1.5 block">Financial Year Cycle</span>
                  <select
                    value={form.financialYear}
                    onChange={(e) => update("financialYear", e.target.value)}
                    className="form-input text-xs"
                  >
                    <option value="April – March" className="bg-[#111722] text-white">
                      April – March (Standard India)
                    </option>
                    <option value="January – December" className="bg-[#111722] text-white">
                      January – December (Calendar)
                    </option>
                  </select>
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-semibold text-zinc-300">
                  <span className="mb-1.5 block">Opening Cash Reserves (₹)</span>
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.openingCash}
                    onChange={(e) => update("openingCash", e.target.value)}
                    className="form-input font-mono text-xs"
                  />
                </label>

                <label className="block text-xs font-semibold text-zinc-300">
                  <span className="mb-1.5 block">Monthly Revenue Target (₹)</span>
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.monthlyRevenueTarget}
                    onChange={(e) => update("monthlyRevenueTarget", e.target.value)}
                    className="form-input font-mono text-xs"
                  />
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={create.isPending}
                  className="btn-primary w-full rounded-xl py-3.5 text-xs font-bold disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  <span>{create.isPending ? "Creating Workspace..." : "Create Business Workspace"}</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
