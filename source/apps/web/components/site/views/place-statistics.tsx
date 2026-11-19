"use client";

/** A place's statistics (`/<place>/data/statistics`): a place's statistics by topic, with history, breakdowns, comparison and a map of what lies inside it. */
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AsyncView } from "#/components/site/async-view.tsx";
import { StatMap } from "#/components/site/stat-map.tsx";
import { AgeBars, BarList, Donut, LineChart, Sparkline } from "#/components/site/ui/charts.tsx";
import { Gaps, PageFrame, PlaceTabs, PlaceTrail, Section, Stat } from "#/components/site/ui/primitives.tsx";
import { n, n1, pct, short } from "#/lib/site/format.ts";
import { placeAt } from "#/lib/site/links.ts";
import { mapOf, statisticsOf, type IndicatorView } from "#/lib/site/insights.ts";
import { optional, useAsync } from "#/lib/site/use-async.ts";

function IndicatorCard({ i }: { i: IndicatorView }) {
  const good = i.change === null || i.higherIsBetter === null ? undefined : (i.change > 0) === i.higherIsBetter;
  return (
    <div className="glass card card-lift">
      <p className="text-xs font-semibold uppercase tracking-wide text-content-muted">{i.name}</p>
      <p className="num mt-1 font-display text-3xl">{i.unit === "%" || i.unit === "score" ? n1(i.latest.value) : short(i.latest.value)}<span className="ml-1 text-sm text-content-muted">{i.unit}</span></p>
      <p className="mt-0.5 text-xs text-content-muted">{i.latest.period.slice(0, 4)}{i.latest.estimated ? " · estimate" : ""}
        {i.change !== null ? <span className={good === undefined ? "" : good ? " text-raffia" : " text-danger"}> · {i.change >= 0 ? "▲" : "▼"} {pct(Math.abs(i.change))}</span> : null}</p>
      <Sparkline points={i.series.map((p) => p.value)} label={`${i.name} over time`} />
    </div>
  );
}

export default function PlaceStatistics({ id }: { id: string }) {
  const router = useRouter();
  const loaded = useAsync(() => statisticsOf(id), `stats-${id}`);
  const inside = useAsync(() => mapOf("sta.population.total", id), `inside-${id}`);
  return (
    <PageFrame>
      <AsyncView loaded={loaded}>
        {(s) => {
          const pop = s.topics.flatMap((t) => t.indicators).find((i) => i.code === "sta.population.total");
          const density = s.topics.flatMap((t) => t.indicators).find((i) => i.code === "sta.population.density");
          const area = s.topics.flatMap((t) => t.indicators).find((i) => i.code === "sta.area.km2");
          const b = s.breakdowns;
          return (
            <>
              <PlaceTrail chain={s.chain} section={{ label: "Statistics", suffix: "data/statistics" }} />
              <PlaceTabs path={s.place.path} />
              <p className="kicker">{s.place.kindLabel} · statistics</p>
              <h1 className="hero-title text-4xl sm:text-5xl">{s.place.name}</h1>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Stat label="Population" value={short(pop?.latest.value)} hint={pop ? `${pop.latest.period.slice(0, 4)} · ${pop.latest.estimated ? "estimate" : "census"}` : undefined} />
                <Stat label="People per km²" value={density ? n(density.latest.value) : "—"} hint={s.siblings.density ? `#${s.siblings.density.position} of ${s.siblings.density.of} alike` : undefined} />
                <Stat label="Land area" value={area ? `${short(area.latest.value)} km²` : "—"} />
                <Stat label="Rank by population" value={s.siblings.population ? `#${s.siblings.population.position}` : "—"} hint={s.siblings.population ? `of ${s.siblings.population.of} in the same parent` : undefined} />
              </div>
              <Section kicker="Growth" title="Population over time">
                <div className="glass card"><LineChart points={pop?.series ?? []} unit="people" label={`Population of ${s.place.name} over time`} /><p className="mt-1 text-xs text-content-muted">Hollow points are yearly estimates between and after the censuses.</p></div>
              </Section>
              <Section kicker="Who lives here" title="People">
                <div className="grid gap-4 lg:grid-cols-3">
                  {b.sex ? <div className="glass card"><h3 className="mb-3 font-semibold">Women and men</h3><Donut label="Population by sex" slices={b.sex.map((x) => ({ label: x.label, value: x.value }))} /></div> : null}
                  {b.residence ? <div className="glass card"><h3 className="mb-3 font-semibold">Town or countryside</h3><Donut label="Population by residence" slices={b.residence.map((x) => ({ label: x.label, value: x.value }))} /></div> : null}
                  {b.age ? <div className="glass card"><h3 className="mb-3 font-semibold">Age</h3><AgeBars groups={b.age} /></div> : null}
                  {b.community ? <div className="glass card lg:col-span-2"><h3 className="mb-3 font-semibold">Communities</h3><BarList items={b.community.slice(0, 8).map((x) => ({ label: x.label, value: x.share, note: n(x.value) }))} unit="pct" /><p className="mt-3 text-xs text-content-muted">Shares are modelled from the census; they are estimates.</p></div> : null}
                  {b.language ? <div className="glass card"><h3 className="mb-3 font-semibold">Languages spoken at home</h3><BarList items={b.language.slice(0, 7).map((x) => ({ label: x.label, value: x.value }))} unit="short" /></div> : null}
                </div>
              </Section>
              {s.topics.filter((t) => t.indicators.some((i) => !["sta.population.total", "sta.population.density", "sta.area.km2", "sta.population.language-speakers"].includes(i.code))).map((topic) => (
                <Section key={topic.code} title={topic.label} kicker="Indicators">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {topic.indicators.filter((i) => !["sta.population.total", "sta.population.density", "sta.area.km2", "sta.population.language-speakers"].includes(i.code)).map((i) => <IndicatorCard key={i.code} i={i} />)}
                  </div>
                </Section>
              ))}
              <Section kicker="Compared" title="Against its parents">
                <div className="glass card overflow-x-auto">
                  <table className="table-clean">
                    <thead><tr><th>Place</th><th>Level</th><th>People</th><th>Area (km²)</th><th>Per km²</th></tr></thead>
                    <tbody>{s.comparisons.map((c) => (
                      <tr key={c.place.featureId}><td><Link className="underline" href={placeAt(c.place.path, "data/statistics")}>{c.place.name}</Link></td><td>{c.place.kindLabel}</td><td className="num">{n(c.population)}</td><td className="num">{n(c.areaKm2)}</td><td className="num">{n(c.density)}</td></tr>
                    ))}</tbody>
                  </table>
                </div>
              </Section>
              <AsyncView loaded={optional(inside)}>
                {(m) => m && m.units.length > 1 ? (
                  <Section kicker="Inside" title={`Population of places inside ${s.place.name}`}>
                    <StatMap data={m} height={380} onSelect={(path) => router.push(placeAt(path, "data/statistics"))} />
                  </Section>
                ) : null}
              </AsyncView>
              <Gaps items={s.gaps} topic={`statistics for ${s.place.name}`} />
            </>
          );
        }}
      </AsyncView>
    </PageFrame>
  );
}
