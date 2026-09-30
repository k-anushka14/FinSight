import { type ReactNode } from "react";
import { type LucideIcon, Sparkles, Plus } from "lucide-react";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  text: string;
  action?: string | ReactNode;
  onClick?: () => void;
  secondaryAction?: ReactNode;
  hint?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon = Sparkles,
  title,
  text,
  action,
  onClick,
  secondaryAction,
  hint,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-[#111722]/60 p-8 text-center backdrop-blur-sm sm:p-12 ${className}`}
    >
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute -top-12 size-40 rounded-full bg-emerald-500/5 blur-3xl" />

      {/* Glowing icon badge */}
      <div className="relative mb-4 grid size-14 place-items-center rounded-2xl border border-white/[0.1] bg-[#161F2E] text-emerald-400 shadow-xl shadow-black/40">
        <Icon size={26} strokeWidth={1.8} />
        <span className="absolute -bottom-1 -right-1 flex size-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex size-3 rounded-full bg-emerald-500" />
        </span>
      </div>

      <h3 className="font-display text-base font-semibold text-white sm:text-lg">
        {title}
      </h3>
      <p className="mt-1.5 max-w-md text-xs text-zinc-400 sm:text-sm leading-relaxed">
        {text}
      </p>

      {hint && (
        <div className="mt-3 rounded-lg bg-white/[0.03] border border-white/[0.05] px-3 py-1.5 text-[11px] text-zinc-500">
          💡 {hint}
        </div>
      )}

      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {action && (
            typeof action === "string" ? (
              <button
                type="button"
                onClick={onClick}
                className="btn-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold"
              >
                <Plus size={15} />
                <span>{action}</span>
              </button>
            ) : (
              action
            )
          )}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
