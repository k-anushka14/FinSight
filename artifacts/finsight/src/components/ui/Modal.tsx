import { useEffect, type ReactNode } from "react";
import { X, Volume2 } from "lucide-react";

export interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  onListen?: () => void;
  subtitle?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

const maxWidthMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

export function Modal({
  title,
  onClose,
  children,
  onListen,
  subtitle,
  maxWidth = "md",
}: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/80 p-4 backdrop-blur-md animate-fade-in">
      {/* Click outside to close */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div
        className={`relative my-8 w-full ${maxWidthMap[maxWidth]} overflow-hidden rounded-2xl border border-white/[0.1] bg-[#111722] p-6 shadow-2xl shadow-black/80 animate-rise sm:p-7`}
      >
        {/* Subtle ambient glow on header */}
        <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 size-48 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative mb-6 flex items-start justify-between gap-4 border-b border-white/[0.06] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg font-bold tracking-tight text-white sm:text-xl">
                {title}
              </h2>
              {onListen && (
                <button
                  type="button"
                  onClick={onListen}
                  aria-label={`Listen: what does ${title} mean`}
                  className="grid size-7 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-zinc-400 transition hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400"
                >
                  <Volume2 size={14} />
                </button>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-zinc-400 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="grid size-8 shrink-0 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-400 transition hover:bg-white/[0.08] hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="relative max-h-[calc(85vh-100px)] overflow-y-auto pr-1 scrollbar-thin">
          {children}
        </div>
      </div>
    </div>
  );
}
