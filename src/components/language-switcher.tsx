"use client";

import { useLocale } from "@/lib/i18n/locale-context";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useLocale();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "ar" : "en")}
      className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
      title={locale === "en" ? "التبديل إلى العربية" : "Switch to English"}
    >
      <span className="text-base">{locale === "en" ? "🇸🇦" : "🇬🇧"}</span>
      {!compact && <span>{locale === "en" ? "العربية" : "English"}</span>}
    </button>
  );
}
