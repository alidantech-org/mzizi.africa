"use client";

/** A year slider across every election: drag it and the map, winner and register size change together. */
import { useMemo, useState } from "react";

import { AsyncView } from "#/components/site/async-view.tsx";
import { ChoroplethLazy } from "#/components/site/map/choropleth-lazy.tsx";
import { Stacked } from "#/components/site/ui/charts.tsx";
import { Icon } from "#/components/brand/icon.tsx";
import { n, pct } from "#/lib/site/format.ts";
import { electionOf, type ElectionSummary } from "#/lib/site/insights.ts";
import { categoryFill } from "#/lib/site/ramp.ts";
import { useAsync } from "#/lib/site/use-async.ts";

export function ElectionTimeline({ elections }: { elections: ElectionSummary[] }) {
  const ordered = useMemo(() => [...elections].sort((a, b) => a.year - b.year), [elections]);
  const [index, setIndex] = useState(ordered.length - 1);
  const current = ordered[index]!;
  const loaded = useAsync(() => electionOf(current.electionId, undefined, "presidential"), `timeline-${current.electionId}`);
  const growth = ordered.map((e) => e.registeredVoters ?? 0);
  return (
    <div className="glass card">
      <div className="flex flex-wrap items-center gap-4">
        <Icon name="calendar" size={22} />
        <div className="min-w-56 flex-1">
          <label htmlFor="timeline" className="text-sm font-semibold">Election year: <span className="num text-clay">{current.year}</span></label>
          <input id="timeline" type="range" min={0} max={ordered.length - 1} step={1} value={index} onChange={(e) => setIndex(Number(e.target.value))} className="mt-2 w-full accent-[var(--clay)]" aria-valuetext={`${current.year}`} />
          <div className="flex justify-between text-xs text-content-muted">{ordered.map((e) => <span key={e.electionId}>{e.year}</span>)}</div>
        </div>
        <div className="text-right"><p className="text-xs uppercase tracking-wide text-content-muted">Registered voters</p><p className="num font-display text-2xl">{n(current.registeredVoters)}</p>
          {index > 0 && growth[index - 1] ? <p className="text-xs text-raffia">▲ {pct((growth[index]! - growth[index - 1]!) / growth[index - 1]!)} since {ordered[index - 1]!.year}</p> : null}</div>
      </div>
      <AsyncView loaded={loaded}>
        {(d) => {
          const parties = [...new Set(d.units.map((u) => u.winner.partyCode ?? "independent"))];
          return (
            <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
              <ChoroplethLazy height={360} regions={d.units.map((u) => ({ featureId: u.featureId, name: u.name, geometry: u.geometry, fill: categoryFill(u.winner.partyCode ?? "independent", parties), tooltip: `${u.winner.name} · ${pct(u.winner.share)} · turnout ${pct(u.turnout)}` }))} />
              <div>
                <p className="kicker">{current.year} presidential result</p>
                <ul className="mt-2 space-y-3">{d.totals.slice(0, 3).map((t) => <li key={t.name}><div className="flex justify-between text-sm"><span className="font-semibold">{t.name}</span><span className="num">{n(t.votes)}</span></div><div className="text-xs text-content-muted">{t.party ?? "Independent"} · {pct(t.share)}</div></li>)}</ul>
                <div className="mt-4"><Stacked label="Share of votes" parts={d.totals.slice(0, 4).map((t) => ({ label: t.name, value: t.votes }))} /></div>
                <p className="mt-3 text-xs text-content-muted">Colours show the winning party in each county.</p>
              </div>
            </div>
          );
        }}
      </AsyncView>
    </div>
  );
}
