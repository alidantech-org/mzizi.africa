"use client";
/** Winning party by county. Hue is the winner, strength is the margin. */
import { electionByCounty, parties } from "#/data/demo";
import { GeoMap } from "./geo-map";

export function ElectionMap({ selected }: { selected?: string }) {
  const fills = Object.fromEntries(electionByCounty.map((c) => {
    const col = parties.find((p) => p.id === c.winner)!.color;
    return [c.code, `color-mix(in srgb, var(--${col}) ${Math.round(35 + Math.min(c.margin, 40) * 1.6)}%, var(--surface))`];
  }));
  const titles = Object.fromEntries(electionByCounty.map((c) => [c.slug, `${c.winner} by ${c.margin} pts`]));
  return (
    <>
      <GeoMap fills={fills} titles={titles} selected={selected} />
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">{parties.map((p) => <span key={p.id} className="flex items-center gap-2"><span className="size-3 rounded-full" style={{ background: `var(--${p.color})` }} />{p.id} · {p.name}</span>)}</div>
    </>
  );
}
