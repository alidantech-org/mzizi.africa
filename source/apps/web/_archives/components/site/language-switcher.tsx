"use client";

import { useLanguage, type Language } from "#/_archives/lib/site/i18n";

const CHOICES: readonly { readonly code: Language; readonly label: string }[] =
  [
    { code: "en", label: "EN" },
    { code: "sw", label: "SW" },
  ];

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div
      role="group"
      aria-label={t("language")}
      className="glass flex h-10 items-center rounded-full p-1"
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
