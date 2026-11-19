"use client";

/** The measure and level pickers of the statistics explorer; choosing one reloads the page with the choice in the address. */
import { useRouter } from "next/navigation";

export interface Choice { readonly code: string; readonly title: string }

export function StatControls({ indicator, level, choices, levels }: { indicator: string; level: string; choices: readonly Choice[]; levels: readonly Choice[] }) {
  const router = useRouter();
  const go = (next: Record<string, string>) => router.push(`/data/statistics?${new URLSearchParams({ indicator, kind: level, ...next }).toString()}`);
  return (
    <div className="glass mb-4 flex flex-wrap items-center gap-3 rounded-3xl p-3">
      <label className="text-sm font-semibold" htmlFor="indicator">Measure</label>
      <select id="indicator" className="glass rounded-full bg-transparent px-4 py-2 text-sm" value={indicator} onChange={(e) => go({ indicator: e.target.value })}>
        {choices.map((c) => <option key={c.code} value={c.code}>{c.title}</option>)}
      </select>
      <label className="ml-2 text-sm font-semibold" htmlFor="level">Level</label>
      <select id="level" className="glass rounded-full bg-transparent px-4 py-2 text-sm" value={level} onChange={(e) => go({ kind: e.target.value })}>
        {levels.map((l) => <option key={l.code} value={l.code}>{l.title}</option>)}
      </select>
    </div>
  );
}
