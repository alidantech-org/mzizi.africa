/** One displayed text from the API (`LocalizedText`): its language and direction are set, and a fallback is marked. */
import { Info } from "lucide-react";
import type { SharedLocalizedText } from "@mzizi/api-client";

export function Text({ value, showFallbackIcon = false }: { value: SharedLocalizedText | null | undefined; showFallbackIcon?: boolean }) {
  if (!value) return null;
  return (
    <span lang={value.language} dir={value.direction} className="inline-flex items-center gap-1">
      {value.text}
      {value.isFallback && showFallbackIcon && (
        <Info className="h-3 w-3 text-muted" aria-label="Shown in another language (translated from requested language)" />
      )}
    </span>
  );
}

/** A number for display in the reader's language, with the indicator's decimals. */
export function formatValue(value: number | null | undefined, decimals: number | null | undefined, language: string): string {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat(language, { maximumFractionDigits: decimals ?? 0 }).format(value);
}
