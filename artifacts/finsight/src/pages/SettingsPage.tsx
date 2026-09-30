import { useState } from "react";
import { toast } from "sonner";
import { useAuth, useUser } from "@clerk/react";
import {
  Bell,
  Check,
  CheckCircle2,
  DollarSign,
  Globe,
  IndianRupee,
  MessageCircle,
  Phone,
  Shield,
  Target,
  Wallet,
} from "lucide-react";
import { compact, inr, type BusinessBootstrap } from "@/lib/financials";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "../components/ui/Badge";

interface SettingsPageProps {
  data: BusinessBootstrap;
  onRefresh: () => void;
}

export function SettingsPage({ data, onRefresh }: SettingsPageProps) {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [whatsappPhone, setWhatsappPhone] = useState(
    data.business.whatsappPhone ?? "",
  );
  const [whatsappBusy, setWhatsappBusy] = useState(false);
  const [justConnected, setJustConnected] = useState(false);

  async function saveWhatsappPhone() {
    setWhatsappBusy(true);
    try {
      const token = await getToken();
      const res = await fetch("/api/business/whatsapp-phone", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ whatsappPhone }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast.error(body.error ?? "Couldn't save that number");
        return;
      }

      toast.success(
        whatsappPhone
          ? "WhatsApp number connected successfully!"
          : "WhatsApp number disconnected",
      );
      setJustConnected(true);
      setTimeout(() => setJustConnected(false), 4000);
      onRefresh();
    } catch {
      toast.error("Couldn't reach the server — check your connection");
    } finally {
      setWhatsappBusy(false);
    }
  }

  const isWhatsappConnected = Boolean(data.business.whatsappPhone);

  return (
    <div className="space-y-6 animate-rise">
      <PageHeader
        kicker="Workspace Configuration"
        title="Settings & Integrations"
        description="Manage your business entity details, WhatsApp instant expense capture, financial year settings, and operating targets."
        action={
          saved ? (
            <Badge tone="emerald" size="md">
              <Check size={13} className="mr-1" /> Preferences Saved
            </Badge>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSaved(true);
                toast.success("Preferences updated successfully");
              }}
              className="btn-primary inline-flex h-10 items-center gap-1.5 rounded-xl px-4 text-xs font-semibold"
            >
              <Check size={14} />
              <span>Save Changes</span>
            </button>
          )
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Workspace & Business Info Card */}
        <div className="glass-card rounded-2xl p-6 card-hover-effect space-y-6">
          <div className="flex items-center gap-3 border-b border-white/[0.06] pb-5">
            <div className="grid size-12 place-items-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 font-bold font-display text-base shadow-sm">
              {data.business.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white">
                {data.business.name}
              </h2>
              <p className="text-xs text-zinc-400">
                Managed by {user?.fullName ?? "Account Owner"} · {user?.primaryEmailAddress?.emailAddress ?? "Active Account"}
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <label className="block space-y-1.5">
              <span className="font-semibold text-zinc-300">Registered Business Name</span>
              <input
                readOnly
                className="form-input opacity-90 cursor-not-allowed"
                value={data.business.name}
              />
            </label>

            <label className="block space-y-1.5">
              <span className="font-semibold text-zinc-300">Operating Location / Hub</span>
              <input
                readOnly
                className="form-input opacity-90 cursor-not-allowed"
                value={data.business.location}
              />
            </label>

            <label className="block space-y-1.5">
              <span className="font-semibold text-zinc-300">Financial Reporting Cycle</span>
              <input
                readOnly
                className="form-input opacity-90 cursor-not-allowed"
                value={data.business.financialYear}
              />
            </label>
          </div>
        </div>

        {/* WhatsApp Integration Card */}
        <div className="glass-card rounded-2xl p-6 card-hover-effect flex flex-col justify-between border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
          <div className="space-y-4">
            <div className="flex items-start justify-between border-b border-white/[0.06] pb-4">
              <div className="flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-2xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] shadow-sm">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-base font-bold text-white">
                      WhatsApp Assistant
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Log transactions on the go via chat
                  </p>
                </div>
              </div>

              <Badge
                tone={isWhatsappConnected ? "emerald" : "neutral"}
                size="md"
                dot
              >
                {isWhatsappConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Connect your WhatsApp number to log expenses and revenue in seconds. Send messages like <span className="font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">paid 1200 for diesel</span> or <span className="font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">received 25000 from Apex</span> directly from your phone.
            </p>

            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-zinc-300">
                Phone Number (with Country Code)
              </label>
              <div className="relative">
                <Phone
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                />
                <input
                  type="tel"
                  className="form-input pl-10 font-mono text-xs"
                  placeholder="+919876543210"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                />
              </div>
            </div>

            {justConnected && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2 animate-rise">
                <CheckCircle2 size={16} />
                <span>Integration active! Send a test message to your FinSight bot.</span>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
            <span className="text-[11px] text-zinc-400">
              {isWhatsappConnected
                ? `Active number: ${data.business.whatsappPhone}`
                : "No phone linked"}
            </span>

            <button
              type="button"
              onClick={saveWhatsappPhone}
              disabled={whatsappBusy}
              className="btn-primary rounded-xl px-4 py-2 text-xs font-semibold disabled:opacity-50"
            >
              {whatsappBusy
                ? "Connecting..."
                : isWhatsappConnected
                ? "Update Phone"
                : "Connect WhatsApp"}
            </button>
          </div>
        </div>

        {/* Operating Targets & Currency */}
        <div className="glass-card rounded-2xl p-6 card-hover-effect space-y-5 lg:col-span-2">
          <div className="border-b border-white/[0.06] pb-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400">
              Financial Baseline
            </div>
            <h2 className="font-display text-base font-bold text-white">
              Targets, Currency & Opening Balances
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-1">
              <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium">
                <Globe size={15} />
                <span>Base Currency</span>
              </div>
              <div className="font-display text-xl font-bold text-white">
                {data.business.currency === "INR" ? "Indian Rupee (INR ₹)" : data.business.currency}
              </div>
              <div className="text-[11px] text-zinc-400">
                Standard ISO representation
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-1">
              <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium">
                <Wallet size={15} />
                <span>Opening Cash Balance</span>
              </div>
              <div className="font-display text-xl font-bold text-white font-mono">
                {compact(data.business.openingCash)}
              </div>
              <div className="text-[11px] text-zinc-400">
                Bank & cash-in-hand baseline
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-1">
              <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium">
                <Target size={15} />
                <span>Monthly Revenue Target</span>
              </div>
              <div className="font-display text-xl font-bold text-emerald-400 font-mono">
                {compact(data.business.monthlyRevenueTarget)}
              </div>
              <div className="text-[11px] text-zinc-400">
                Target pace for monthly runway
              </div>
            </div>
          </div>

          {/* Action alerts switch */}
          <div className="pt-2">
            <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
              <div className="flex items-center gap-3">
                <div className="grid size-9 place-items-center rounded-lg border border-white/[0.08] bg-[#161F2E] text-emerald-400">
                  <Bell size={17} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">
                    Proactive Action Alerts & Spikes
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Notify when category expenditure exceeds historical 30-day moving average.
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setNotifications(!notifications)}
                aria-label="Toggle notifications"
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  notifications ? "bg-emerald-500" : "bg-white/[0.1]"
                }`}
              >
                <span
                  className={`absolute top-1 size-4 rounded-full bg-black transition-all ${
                    notifications ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
