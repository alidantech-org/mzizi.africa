"use client";

/**
 * Interface language. The words of the interface live here (English and Swahili); the names and labels of places,
 * offices and kinds come from the API in the language chosen here, so the system's own translations are used
 * wherever it holds them. The choice is remembered in the browser.
 */
import { useRouter } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { phraseKey, wordKey } from "#/lib/site/copy-key.ts";

export type Language = "en" | "sw";

/** An interface word: its copy key is `web.word.<name>`. */
export type Word = string;

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (word: Word) => string;
  /** Translates a sentence or heading of the newer pages; `{}` holes take the values in order. */
  tr: (english: string, ...values: (string | number | null | undefined)[]) => string;
}

const LanguageContext = createContext<LanguageState | null>(null);

/**
 * The interface language and its wording. The wording comes from the database (copy rows delivered by the API for the
 * language in the cookie); a sentence with no row shows in English, and a word with no row shows its own name.
 */
export function LanguageProvider({
  children,
  initialLanguage,
  copy,
}: {
  children: ReactNode;
  initialLanguage: Language;
  copy: Readonly<Record<string, string>>;
}) {
  const router = useRouter();
  const [language, setLanguageState] = useState<Language>(initialLanguage);
  useEffect(() => setLanguageState(initialLanguage), [initialLanguage]);
  const setLanguage = useCallback(
    (next: Language) => {
      setLanguageState(next);
      document.cookie = `mz_lang=${next}; path=/; max-age=31536000; samesite=lax`;
      router.refresh();
    },
    [router],
  );
  const value = useMemo<LanguageState>(
    () => ({
      language,
      setLanguage,
      t: (word) => copy[wordKey(word)] ?? word,
      tr: (english, ...values) => {
        let text = language === "en" ? english : (copy[phraseKey(english)] ?? english);
        for (const v of values) text = text.replace("{}", String(v ?? "—"));
        return text;
      },
    }),
    [language, setLanguage, copy],
  );
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageState {
  const value = useContext(LanguageContext);
  if (value === null) throw new Error("useLanguage needs a LanguageProvider");
  return value;
}

/** A sentence or heading of the newer pages, shown in the interface language. */
export function T({ children }: { children: string }) {
  return <>{useLanguage().tr(children)}</>;
}
