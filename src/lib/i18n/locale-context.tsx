"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { dictionaries, type Locale, type Dictionary } from "./dictionaries";

interface LocaleContextValue {
  locale: Locale;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
  isRTL: boolean;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

const STORAGE_KEY = "crm_locale";

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored && dictionaries[stored]) {
      setLocaleState(stored);
    }
  }, []);

  useEffect(() => {
    // Update html dir and lang attributes
    document.documentElement.setAttribute("dir", dictionaries[locale].dir);
    document.documentElement.setAttribute("lang", locale);
    // Store preference
    localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const setLocale = (l: Locale) => setLocaleState(l);

  return (
    <LocaleContext.Provider value={{ locale, t: dictionaries[locale], setLocale, isRTL: locale === "ar" }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
