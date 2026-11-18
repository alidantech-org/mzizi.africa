"use client";

/** Route `/elections/<id>`: one election as a heat map and a table. Choose the contest and drill into a region. */
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { AsyncView } from "#/components/site/async-view.tsx";
import { ChoroplethLazy } from "#/components/site/map/choropleth-lazy.tsx";
import { BarList, Stacked, paletteAt } from "#/components/site/ui/charts.tsx";
import { Breadcrumbs, Gaps, PageFrame, Section } from "#/components/site/ui/primitives.tsx";
import { date, n, pct, short, words } from "#/lib/site/format.ts";
import { categoryFill, rampFill } from "#/lib/site/ramp.ts";
import { browse, electionOf, type ElectionUnit } from "#/lib/site/insights.ts";
import { useAsync } from "#/lib/site/use-async.ts";

type Lens = "winner" | "turnout" | "margin";

function Detail() {
  const { id } = useParams<{ id: string }>();
  const q = useSearchParams();
  const router = useRouter();
  const contest = q.get("contest") ?? undefined;
  const parent = q.get("parent") ?? undefined;
  const [lens, setLens] = useState<Lens>("winner");
  const loaded = useAsync(() => electionOf(id, parent, contest), `election-${id}-${contest}-${parent}`);
  const crumb = useAsync(() => (parent ? browse(parent) : Promise.resolve(null)), `crumb-${parent}`);
  const go = (next: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries({ contest, parent, ...next })) if (v) params.set(k, v);
    router.push(`/elections/${id}${params.size ? `?${params}` : ""}`);
  };
  return (
    <PageFrame wide>
      <AsyncView loaded={loaded}>
        {(d) => <Body d={d} lens={lens} setLens={setLens} go={go} parentName={crumb.state === "ready" ? crumb.value?.place?.name ?? null : null} />}
      </AsyncView>
    </PageFrame>
  );
}

function Body({ d, lens, setLens, go, parentName }: { d: Awaited<ReturnType<typeof electionOf>>; lens: Lens; setLens: (l: Lens) => void; go: (n: Record<string, string | undefined>) => void; parentName: string | null }) {
  const router = useRouter();
  const [selected, setSelected] = useState<ElectionUnit | null>(null);
  const parties = useMemo(() => [...new Set(d.units.map((u) => u.winner.partyCode ?? "independent"))], [d]);
  const turnouts = d.units.map((u) => u.turnout ?? 0);
  const maxTurn = Math.max(...turnouts, 0.01);
  const margins = d.units.map((u) => u.winner.margin ?? 0);
  const maxMargin = Math.max(...margins, 0.01);
  const regions = d.units.map((u) => ({
    featureId: u.featureId, name: u.name, geometry: u.geometry,
    fill: lens === "winner" ? categoryFill(u.winner.partyCode ?? "independent", parties) : lens === "turnout" ? rampFill((u.turnout ?? 0) / maxTurn) : rampFill((u.winner.margin ?? 0) / maxMargin),
    tooltip: `${u.winner.name} (${u.winner.party ?? "independent"}) · ${pct(u.winner.share)} · turnout ${pct(u.turnout)}`,
  }));
  const kind = d.election.contestKind;
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Elections", href: "/elections" }, { label: `${d.election.year}`, hint: date(d.election.heldOn) }, ...(parentName ? [{ label: parentName }] : [])]} />
      <p className="kicker">{date(d.election.heldOn)}</p>
      <h1 className="hero-title text-4xl sm:text-5xl">{d.election.year} general election</h1>
      <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Contest">
        {d.contests.map((c) => <button key={c.kind} role="tab" className="tab" data-active={kind === c.kind} onClick={() => go({ contest: c.kind, parent: undefined })}>{words(c.kind)} · {c.contests}</button>)}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {d.totals.slice(0, 3).map((t, i) => (
          <div key={t.name} className="glass card"><p className="chip" style={{ color: paletteAt(i) }}>#{i + 1}</p><p className="mt-2 font-display text-xl">{t.name}</p><p className="text-sm text-content-muted">{t.party ?? "Independent"}</p><p className="num mt-1 text-2xl font-semibold">{n(t.votes)}</p><p className="text-sm text-content-muted">{pct(t.share)} of votes counted here</p></div>
        ))}
      </div>
      <Section kicker="Where" title="Results across the map" action={
        <div className="flex gap-1" role="group" aria-label="Colour the map by">
          {(["winner", "turnout", "margin"] as const).map((l) => <button key={l} className="tab" data-active={lens === l} onClick={() => setLens(l)}>{l === "winner" ? "Winner" : l === "turnout" ? "Turnout" : "Winning margin"}</button>)}
        </div>}>
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <ChoroplethLazy regions={regions} height={460} selectedId={selected?.featureId} onSelect={(fid) => setSelected(d.units.find((u) => u.featureId === fid) ?? null)} />
          <div className="glass card">
            {selected ? (
              <>
                <h3 className="font-display text-2xl">{selected.name}</h3>
                <p className="text-sm text-content-muted">{n(selected.registered)} registered · turnout {pct(selected.turnout)}</p>
                <div className="my-4"><Stacked label="Share of votes" parts={selected.candidates.map((c) => ({ label: c.name, value: c.votes }))} /></div>
                <BarList items={selected.candidates.slice(0, 6).map((c) => ({ label: `${c.name} (${c.party ?? "ind."})`, value: c.share, note: n(c.votes) }))} format={(v) => pct(v)} />
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link className="btn btn-primary" href={`/elections/place/${selected.featureId}`}>This place's history</Link>
                  {kind === "presidential" || kind === "governor" ? <button className="btn btn-ghost" onClick={() => go({ contest: "member-of-parliament", parent: selected.featureId })}>Constituencies inside</button> : null}
                </div>
              </>
            ) : (
              <>
                <h3 className="font-display text-xl">How to read this</h3>
                <p className="mt-2 text-sm text-content-muted">Click a region on the map. {lens === "winner" ? "Colours show the winning party in each region." : lens === "turnout" ? "Darker means a larger share of registered voters took part." : "Darker means the winner was further ahead of the runner-up."}</p>
                <ul className="mt-4 space-y-1.5 text-sm">{parties.map((p) => <li key={p} className="flex items-center gap-2"><i className="inline-block h-3 w-3 rounded-full" style={{ background: categoryFill(p, parties) }} />{d.units.find((u) => (u.winner.partyCode ?? "independent") === p)?.winner.party ?? "Independent"}</li>)}</ul>
              </>
            )}
          </div>
        </div>
      </Section>
      <Section kicker="Numbers" title="Results by region">
        <div className="glass card overflow-x-auto">
          <table className="table-clean">
            <thead><tr><th>Region</th><th>Winner</th><th>Party</th><th>Votes</th><th>Share</th><th>Registered</th><th>Turnout</th></tr></thead>
            <tbody>{d.units.map((u) => (
              <tr key={u.featureId} className="cursor-pointer" onClick={() => router.push(`/elections/place/${u.featureId}`)}>
                <td className="font-semibold">{u.name}</td><td>{u.winner.name}</td><td>{u.winner.party ?? "Independent"}</td><td className="num">{short(u.winner.votes)}</td><td className="num">{pct(u.winner.share)}</td><td className="num">{short(u.registered)}</td><td className="num">{pct(u.turnout)}</td>
              </tr>))}</tbody>
          </table>
        </div>
      </Section>
      <Gaps items={d.gaps} topic={`${d.election.year} election results`} />
    </>
  );
}

export default function ElectionDetailRoute() {
  return <Suspense><Detail /></Suspense>;
}
