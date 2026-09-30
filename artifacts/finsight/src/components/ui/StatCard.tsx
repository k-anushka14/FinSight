import { type ReactNode } from "react";
import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

export interface StatCardProps {
  label: string;
  value: string | number;
  delta?: string;
  trend?: "up" | "down" | "neutral";
  subtitle?: string;
  icon: LucideIcon;
  tone?: "emerald" | "amber" | "cyan" | "blue" | "rose" | "purple";
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
}

const toneStyles = {
  emerald: {
    iconBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    glow: "group-hover:border-emerald-500/30 group-hover:shadow-[0_0_20px_-3px_rgba(16,185,129,0.15)]",
    tag: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    gradient: "from-emerald-500/5 to-transparent",
  },
  amber: {
    iconBg: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    glow: "group-hover:border-amber-500/30 group-hover:shadow-[0_0_20px_-3px_rgba(245,158,11,0.15)]",
    tag: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    gradient: "from-amber-500/5 to-transparent",
  },
  cyan: {
    iconBg: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
    glow: "group-hover:border-cyan-500/30 group-hover:shadow-[0_0_20px_-3px_rgba(6,182,212,0.15)]",
    tag: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    gradient: "from-cyan-500/5 to-transparent",
  },
  blue: {
    iconBg: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    glow: "group-hover:border-blue-500/30 group-hover:shadow-[0_0_20px_-3px_rgba(59,130,246,0.15)]",
    tag: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    gradient: "from-blue-500/5 to-transparent",
  },
  rose: {
    iconBg: "bg-rose-500/10 border-rose-500/20 text-rose-400",
    glow: "group-hover:border-rose-500/30 group-hover:shadow-[0_0_20px_-3px_rgba(244,63,94,0.15)]",
    tag: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    gradient: "from-rose-500/5 to-transparent",
  },
  purple: {
    iconBg: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    glow: "group-hover:border-purple-500/30 group-hover:shadow-[0_0_20px_-3px_rgba(168,85,247,0.15)]",
    tag: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    gradient: "from-purple-500/5 to-transparent",
  },
};

export function StatCard({
  label,
  value,
  delta,
  trend,
  subtitle,
  icon: Icon,
  tone = "emerald",
  onClick,
  className = "",
  children,
}: StatCardProps) {
  const currentTone = toneStyles[tone] || toneStyles.emerald;

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111722]/90 p-5 shadow-lg backdrop-blur-md transition-all duration-200 hover:-translate-y-1 ${currentTone.glow} ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {/* Subtle top gradient accent */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${currentTone.gradient}`}
      />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
            {label}
          </span>
          <div className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl tabular-nums">
            {value}
          </div>
        </div>

        <div
          className={`grid size-11 place-items-center rounded-xl border transition-transform duration-200 group-hover:scale-105 ${currentTone.iconBg}`}
        >
          <Icon size={20} strokeWidth={2.2} />
        </div>
      </div>

      {(delta || subtitle || trend) && (
        <div className="relative z-10 mt-3 flex items-center gap-2 pt-2 border-t border-white/[0.04] text-xs">
          {delta && (
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold border ${currentTone.tag}`}
            >
              {trend === "up" && <TrendingUp size={12} />}
              {trend === "down" && <TrendingDown size={12} />}
              {delta}
            </span>
          )}
          {subtitle && (
            <span className="text-zinc-400 truncate text-[11px]">
              {subtitle}
            </span>
          )}
        </div>
      )}

      {children && <div className="relative z-10 mt-3">{children}</div>}
    </div>
  );
}
