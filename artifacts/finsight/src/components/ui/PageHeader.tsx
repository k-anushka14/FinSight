import { type ReactNode } from "react";

export interface PageHeaderProps {
  kicker?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children?: ReactNode;
}

export function PageHeader({
  kicker,
  title,
  description,
  action,
  children,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end animate-rise">
      <div className="space-y-1.5 max-w-3xl">
        {kicker && (
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-400 glow-dot-emerald animate-pulse" />
            {kicker}
          </div>
        )}
        <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {(action || children) && (
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {action}
          {children}
        </div>
      )}
    </div>
  );
}
