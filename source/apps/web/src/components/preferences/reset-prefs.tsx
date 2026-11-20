"use client";
/** Reset every theme and sound preference to its default. */
import { RotateCcw } from "lucide-react";
import { resetPrefs } from "#/lib/preferences/prefs";

export function ResetPrefs() {
  return (
    <button
      onClick={resetPrefs}
      className="inline-flex items-center gap-2 rounded-md border border-line px-3.5 py-2 text-sm hover:bg-accent-soft"
    >
      <RotateCcw size={14} />
      Reset theme and sound to defaults
    </button>
  );
}
