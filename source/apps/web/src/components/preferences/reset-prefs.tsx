"use client";
/** Reset every theme and sound preference to its default. */
import { RotateCcw } from "lucide-react";
import { copy } from "@mzizi/copy";
import { useCopy } from "#/lib/copy/copy";
import { resetPrefs } from "#/lib/preferences/prefs";

export function ResetPrefs() {
  const t = useCopy();
  return (
    <button
      onClick={resetPrefs}
      className="inline-flex max-w-full items-center gap-2 rounded-md border border-line px-3.5 py-2 text-sm hover:bg-accent-soft"
    >
      <RotateCcw size={14} className="shrink-0" />
      <span className="min-w-0 truncate">{t(copy.pages.me.reset)}</span>
    </button>
  );
}
