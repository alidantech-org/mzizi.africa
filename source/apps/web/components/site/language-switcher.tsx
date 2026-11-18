"use client";

import { useLanguage, type Language } from "#/lib/site/i18n.tsx";

const CHOICES: readonly { readonly code: Language; readonly label: string }[] = [
  { code: "en", label: "EN" },
  { code: "sw", label: "SW" },
];

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div
      role="group"
      aria-label={t("language")}
      className="glass flex rounded-full p-0.5"
    >
      {CHOICES.map((choice) => (
        <button
          key={choice.code}
          type="button"
          onClick={() => setLanguage(choice.code)}
          aria-pressed={language === choice.code}
          data-active={language === choice.code}
          className="tab !px-3 !py-1 !text-xs"
        >
          {choice.label}
        </button>
      ))}
    </div>
  );
}
