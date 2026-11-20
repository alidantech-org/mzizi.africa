"use client";
/** Language preference: cookie only; the address can override it with ?lang=. */
import { useEffect, useState } from "react";

export function LanguageChoice() {
  const [lang, setLang] = useState("en");
  useEffect(() => {
    const m = document.cookie.match(/(?:^|; )mzizi-app-lang=(\w+)/);
    if (m) setLang(m[1]);
  }, []);
  const set = (l: string) => {
    setLang(l);
    document.cookie = `mzizi-app-lang=${l}; path=/; max-age=31536000; samesite=lax`;
  };
  return (
    <div className="mt-3 flex gap-2">
      {[
        ["en", "English"],
        ["sw", "Kiswahili"],
      ].map(([id, label]) => (
        <button
          key={id}
          aria-pressed={lang === id}
          onClick={() => set(id)}
          className={`rounded-md border px-4 py-2 text-sm ${lang === id ? "border-accent bg-accent-soft" : "border-line"}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
