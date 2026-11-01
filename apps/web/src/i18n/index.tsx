import * as React from "react";
import { en, type MessageKey, type Messages } from "./en";
import { id } from "./id";

export const locales = ["en", "id"] as const;
export type Locale = (typeof locales)[number];

const messages: Record<Locale, Messages> = { en, id };
const storageKey = "mytheclipse.locale";

export const localeNames: Record<Locale, string> = { en: "EN", id: "ID" };

/** `lang` set by the pre-paint script in index.html, so SSR-less boot and React agree. */
export function initialLocale(): Locale {
  const fromDocument = document.documentElement.lang;
  if ((locales as readonly string[]).includes(fromDocument)) return fromDocument as Locale;
  return navigator.language.toLowerCase().startsWith("id") ? "id" : "en";
}

type LocaleValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: (key: MessageKey, params?: Record<string, string | number>) => string;
  formatTime: (iso: string) => string;
};

const LocaleContext = React.createContext<LocaleValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [locale, setLocaleState] = React.useState<Locale>(initialLocale);

  const setLocale = React.useCallback((next: Locale) => {
    setLocaleState(next);
    document.documentElement.lang = next;
    localStorage.setItem(storageKey, next);
  }, []);

  const value = React.useMemo<LocaleValue>(() => {
    const table = messages[locale];
    return {
      locale,
      setLocale,
      t: (key, params) => {
        const template = table[key];
        if (!params) return template;
        return template.replace(/\{(\w+)\}/g, (match, name: string) =>
          name in params ? String(params[name]) : match
        );
      },
      formatTime: (iso) =>
        new Date(iso).toLocaleString(locale === "id" ? "id-ID" : "en-GB", {
          dateStyle: "medium",
          timeStyle: "short"
        })
    };
  }, [locale, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleValue {
  const value = React.useContext(LocaleContext);
  if (!value) throw new Error("useLocale must be used inside LocaleProvider");
  return value;
}
