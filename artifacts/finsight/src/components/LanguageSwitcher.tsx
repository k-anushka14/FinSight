import { useLanguage } from "../lib/LanguageContext";
import { LANGUAGES } from "../lib/i18n";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-white/[0.08] bg-[#111722]/80 p-1 text-xs font-semibold backdrop-blur-md shadow-sm">
      <div className="grid size-6 place-items-center text-zinc-400 pl-1">
        <Globe size={13} />
      </div>
      {LANGUAGES.map((option) => {
        const active = lang === option.code;
        return (
          <button
            key={option.code}
            type="button"
            onClick={() => setLang(option.code)}
            className={`rounded-lg px-2.5 py-1 text-xs transition-all duration-150 ${
              active
                ? "bg-emerald-500 text-black font-bold shadow-sm shadow-emerald-500/20"
                : "text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-200"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
