/** One displayed text from the API (`LocalizedText`): its language and direction are set, and a fallback is marked. */
import type { SharedLocalizedText } from "@mzizi/api-client";

export function Text({ value, fallbackNote = "" }: { value: SharedLocalizedText | null | undefined; fallbackNote?: string }) {
  if (!value) return null;
  return (
    <span lang={value.language} dir={value.direction}>
      {value.text}
      {value.isFallback && fallbackNote && <span className="ml-1 font-mono text-[10px] uppercase tracking-widest text-muted">{fallbackNote}</span>}
    </span>
  );
}

/** A number for display in the reader's language, with the indicator's decimals. */
export function formatValue(value: number | null | undefined, decimals: number | null | undefined, language: string): string {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat(language, { maximumFractionDigits: decimals ?? 0 }).format(value);
}
