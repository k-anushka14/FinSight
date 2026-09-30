import { type ReactNode } from "react";

export type BadgeTone = "emerald" | "green" | "amber" | "rose" | "red" | "blue" | "cyan" | "purple" | "neutral";

export interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
}

const toneMap: Record<BadgeTone, { bg: string; text: string; border: string; dot: string }> = {
  emerald: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  green: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  amber: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
    dot: "bg-amber-400",
  },
  rose: {
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/20",
    dot: "bg-rose-400",
  },
  red: {
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/20",
    dot: "bg-rose-400",
  },
  blue: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
    dot: "bg-blue-400",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/20",
    dot: "bg-cyan-400",
  },
  purple: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
    dot: "bg-purple-400",
  },
  neutral: {
    bg: "bg-white/[0.04]",
    text: "text-zinc-400",
    border: "border-white/[0.08]",
    dot: "bg-zinc-400",
  },
};

export function Badge({
  children,
  tone = "neutral",
  size = "md",
  dot = false,
  className = "",
}: BadgeProps) {
  const t = toneMap[tone] || toneMap.neutral;
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${t.bg} ${t.text} ${t.border} ${sizeClasses} ${className}`}
    >
      {dot && <span className={`size-1.5 rounded-full ${t.dot}`} />}
      {children}
    </span>
  );
}
