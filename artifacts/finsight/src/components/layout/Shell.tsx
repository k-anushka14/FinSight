import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useClerk, useUser } from "@clerk/react";
import {
  Activity,
  ArrowDownRight,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  FileBarChart,
  FileCheck2,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  ReceiptIndianRupee,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  WalletCards,
  X,
  Zap,
} from "lucide-react";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { type BusinessBootstrap } from "@workspace/api-client-react";
import { calculateFinancials } from "@/lib/financials";

export interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: number | string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Money",
    items: [
      { href: "/revenue", label: "Revenue", icon: TrendingUp },
      { href: "/transactions", label: "Transactions", icon: ReceiptIndianRupee },
      { href: "/receivables", label: "Receivables", icon: WalletCards },
      { href: "/payables", label: "Payables", icon: ArrowDownRight },
      { href: "/vendors", label: "Vendors", icon: BriefcaseBusiness },
    ],
  },
  {
    title: "Insights",
    items: [
      { href: "/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/forecast", label: "Cash Forecast", icon: Activity },
      { href: "/changes", label: "Month on Month", icon: RefreshCw },
      { href: "/reports", label: "Reports", icon: FileBarChart },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { href: "/invoice-intelligence", label: "Invoice Intelligence", icon: FileCheck2 },
      { href: "/copilot", label: "Business Copilot", icon: Sparkles },
      { href: "/simulator", label: "What-if Simulator", icon: Target },
      { href: "/alerts", label: "Alerts", icon: Bell },
    ],
  },
  {
    title: "Preferences",
    items: [
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

interface ShellProps {
  children: ReactNode;
  data: BusinessBootstrap;
  onRefresh?: () => void;
  onOpenRecordModal?: (type: "revenue" | "expense" | "invoice") => void;
  basePath?: string;
}

export function Shell({
  children,
  data,
  onRefresh,
  onOpenRecordModal,
  basePath = "",
}: ShellProps) {
  const [location] = useLocation();
  const [mobileNav, setMobileNav] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();

  const financials = calculateFinancials(data);
  const alertCount = financials.populated ? 1 : 0;

  const currentNavItem =
    navSections.flatMap((s) => s.items).find((i) => i.href === location) ?? {
      label: "Dashboard",
      icon: LayoutDashboard,
    };

  const handleManualRefresh = () => {
    if (onRefresh) {
      setIsRefreshing(true);
      onRefresh();
      setTimeout(() => setIsRefreshing(false), 800);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B12] text-zinc-100 flex flex-col font-sans">
      {/* SIDEBAR DESKTOP */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[260px] border-r border-white/[0.08] bg-[#070A0F]/95 backdrop-blur-xl px-4 py-5 flex flex-col justify-between transition-transform duration-250 ease-out md:translate-x-0 ${
          mobileNav ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo / Branding */}
          <div className="flex items-center justify-between px-2 pb-5 border-b border-white/[0.06]">
            <Link
              href="/dashboard"
              onClick={() => setMobileNav(false)}
              className="flex items-center gap-3 group"
            >
              <div className="relative grid size-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-black shadow-lg shadow-emerald-500/20 transition-transform duration-200 group-hover:scale-105">
                <Activity size={22} strokeWidth={2.5} />
                <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-emerald-400 glow-dot-emerald animate-pulse" />
              </div>
              <div>
                <span className="block font-display text-lg font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                  FinSight
                </span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400/80">
                  MSME Intelligence
                </span>
              </div>
            </Link>

            <button
              type="button"
              className="md:hidden grid size-8 place-items-center rounded-lg text-zinc-400 hover:bg-white/[0.05] hover:text-white"
              onClick={() => setMobileNav(false)}
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          </div>

          {/* Workspace Card */}
          <div className="mt-4 mb-4 rounded-xl border border-white/[0.08] bg-[#111722]/80 p-3 shadow-sm hover:border-white/[0.12] transition-colors">
            <Link href="/settings" className="flex items-center gap-2.5">
              <div className="grid size-9 place-items-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-xs font-bold text-emerald-300">
                {data.business.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-semibold text-white">
                  {data.business.name}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                  <span className="size-1.5 rounded-full bg-emerald-400 glow-dot-emerald" />
                  <span className="truncate">{data.business.location}</span>
                </div>
              </div>
              <ChevronDown size={14} className="text-zinc-500" />
            </Link>
          </div>

          {/* Navigation Links Grouped */}
          <nav className="scrollbar-thin max-h-[calc(100vh-270px)] space-y-5 overflow-y-auto pr-1">
            {navSections.map((section) => (
              <div key={section.title}>
                <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                  {section.title}
                </div>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const active = location === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileNav(false)}
                        className={`group relative flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-all duration-150 ${
                          active
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 shadow-sm shadow-emerald-500/5 font-semibold"
                            : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100 hover:translate-x-0.5"
                        }`}
                      >
                        {/* Active left indicator bar */}
                        {active && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-emerald-400 glow-dot-emerald" />
                        )}
                        <Icon
                          size={17}
                          strokeWidth={active ? 2.3 : 1.8}
                          className={`transition-colors duration-150 ${
                            active
                              ? "text-emerald-400"
                              : "text-zinc-400 group-hover:text-zinc-200"
                          }`}
                        />
                        <span className="flex-1">{item.label}</span>

                        {item.href === "/alerts" && alertCount > 0 && (
                          <span className="grid size-5 place-items-center rounded-full bg-amber-500/20 border border-amber-500/30 text-[10px] font-bold text-amber-300">
                            {alertCount}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* User Profile & Logout at Bottom */}
        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="grid size-8 place-items-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-bold text-emerald-400">
              {user?.firstName?.[0] ?? "U"}
            </div>
            <div className="min-w-0">
              <div className="truncate text-xs font-semibold text-white">
                {user?.fullName ?? user?.firstName ?? "Owner"}
              </div>
              <div className="truncate text-[10px] text-zinc-500">
                {user?.primaryEmailAddress?.emailAddress ?? "Active"}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => signOut({ redirectUrl: basePath || "/" })}
            title="Log out"
            aria-label="Log out"
            className="grid size-8 place-items-center rounded-lg border border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 transition-colors"
          >
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {mobileNav && (
        <div
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setMobileNav(false)}
        />
      )}

      {/* MAIN CONTENT AREA */}
      <div className="md:pl-[260px] flex flex-col flex-1">
        {/* TOP BAR / HEADER */}
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between gap-3 border-b border-white/[0.08] bg-[#080B12]/80 px-4 sm:px-7 backdrop-blur-xl">
          {/* Left: Mobile hamburger & breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="grid size-9 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-300 hover:bg-white/[0.08] hover:text-white md:hidden"
              onClick={() => setMobileNav(true)}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>

            <div className="hidden items-center gap-2 text-xs sm:flex">
              <Link
                href="/dashboard"
                className="text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1.5"
              >
                <span>FinSight</span>
              </Link>
              <ChevronRight size={13} className="text-zinc-600" />
              <div className="flex items-center gap-1.5 font-semibold text-white">
                <currentNavItem.icon size={14} className="text-emerald-400" />
                <span>{currentNavItem.label}</span>
              </div>
            </div>
          </div>

          {/* Right: Actions, Live Sync, Language, Quick Add */}
          <div className="flex items-center gap-2.5">
            {/* Live Sync Status Pill */}
            <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-400 shadow-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span>Live Sync Active</span>
            </div>

            {/* Manual Refresh Button */}
            {onRefresh && (
              <button
                type="button"
                onClick={handleManualRefresh}
                title="Refresh business data"
                aria-label="Refresh business data"
                className="grid size-9 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-300 hover:bg-white/[0.08] hover:text-white transition-colors"
              >
                <RefreshCw
                  size={14}
                  className={isRefreshing ? "animate-spin text-emerald-400" : ""}
                />
              </button>
            )}

            {/* Language Switcher */}
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            {/* Quick Record Add Button */}
            {onOpenRecordModal && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setQuickAddOpen(!quickAddOpen)}
                  className="btn-primary inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold"
                >
                  <Plus size={15} />
                  <span>Record</span>
                  <ChevronDown size={13} />
                </button>

                {quickAddOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setQuickAddOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 z-40 w-48 rounded-xl border border-white/[0.1] bg-[#111722] p-1.5 shadow-2xl backdrop-blur-xl animate-rise">
                      <button
                        type="button"
                        onClick={() => {
                          setQuickAddOpen(false);
                          onOpenRecordModal("revenue");
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors"
                      >
                        <TrendingUp size={14} className="text-emerald-400" />
                        <span>Add Revenue</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setQuickAddOpen(false);
                          onOpenRecordModal("expense");
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-amber-500/10 hover:text-amber-400 transition-colors"
                      >
                        <TrendingDown size={14} className="text-amber-400" />
                        <span>Add Expense</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setQuickAddOpen(false);
                          onOpenRecordModal("invoice");
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors"
                      >
                        <FileCheck2 size={14} className="text-cyan-400" />
                        <span>Add Invoice</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 p-4 sm:p-7 lg:p-9 max-w-[1560px] w-full mx-auto animate-rise">
          {children}
        </main>
      </div>
    </div>
  );
}
