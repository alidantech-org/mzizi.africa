"use client";

/** Route `/data/statistics`: the country's statistics. Pick an indicator and a level; the map and the ranking follow. */
import { useRouter, useSearchParams } from "next/navigation";
import { placeAt } from "#/lib/site/links.ts";
import { Suspense } from "react";

import { AsyncView } from "#/components/site/async-view.tsx";
import { StatMap } from "#/components/site/stat-map.tsx";
import { Breadcrumbs, Gaps, PageFrame, Section, Stat } from "#/components/site/ui/primitives.tsx";
import { LineChart } from "#/components/site/ui/charts.tsx";
import { n, short } from "#/lib/site/format.ts";
import { useCountry } from "#/lib/site/country.tsx";
import { useLanguage } from "#/lib/site/i18n.tsx";
import { mapOf, metrics, browse, seriesOf } from "#/lib/site/insights.ts";
import { optional, useAsync } from "#/lib/site/use-async.ts";

const EXTRA = [{ code: "sta.population.density", title: "Population density", unit: "per km²" }, { code: "sta.area.km2", title: "Land area", unit: "km²" }];

function Explorer() {
  const country = useCountry();
  const { tr } = useLanguage();
  const router = useRouter();
  const params = useSearchParams();
  const indicator = params.get("indicator") ?? "sta.population.total";
  const level = params.get("kind") ?? "county";
  const list = useAsync(() => metrics(), "metrics");
  const root = useAsync(() => browse(), "root");
  const map = useAsync(() => mapOf(indicator, undefined, level), `map-${indicator}-${level}`);
  const series = useAsync(async () => (root.state === "ready" && root.value.place ? seriesOf("sta.population.total", root.value.place.featureId) : Promise.reject(new Error("wait"))), `series-${root.state}`);
  const go = (next: Record<string, string>) => {
    const q = new URLSearchParams({ indicator, kind: level, ...next });
    router.push(`/data/statistics?${q.toString()}`);
  };
  return (
    <PageFrame wide>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Statistics" }]} />
      <p className="kicker">{tr("{} in numbers", country.name)}</p>
      <h1 className="hero-title text-4xl sm:text-5xl">Statistics</h1>
      <p className="mt-2 max-w-2xl text-content-muted">Population, health, education, poverty, water and openness — for the whole country, every county, constituency and ward, and for towns and villages where they are recorded.</p>
      <AsyncView loaded={optional(series)}>
        {(s) => s ? (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Stat label="Population (latest)" value={short(s.points.at(-1)?.value)} hint={`${s.points.at(-1)?.period.slice(0, 4)} · ${n(s.points.at(-1)?.value)} people`} />
            <Stat label="Counties" value="47" hint="Each with its own statistics page" />
            <div className="glass card md:col-span-1"><p className="text-xs font-semibold uppercase tracking-wide text-content-muted">Population over time</p><LineChart points={s.points} label="Kenya's population over time" height={120} /></div>
          </div>
        ) : null}
      </AsyncView>
      <Section kicker="Explore" title="Compare places on a map">
        <div className="glass mb-4 flex flex-wrap items-center gap-3 rounded-3xl p-3">
          <label className="text-sm font-semibold" htmlFor="indicator">Measure</label>
          <select id="indicator" className="glass rounded-full bg-transparent px-4 py-2 text-sm" value={indicator} onChange={(e) => go({ indicator: e.target.value })}>
            {EXTRA.map((e) => <option key={e.code} value={e.code}>{e.title}</option>)}
            {list.state === "ready" ? list.value.metrics.filter((m) => m.domain === "statistics" && !EXTRA.some((e) => e.code === m.code)).map((m) => <option key={m.code} value={m.code}>{m.title}</option>) : null}
          </select>
          <label className="ml-2 text-sm font-semibold" htmlFor="level">Level</label>
          <select id="level" className="glass rounded-full bg-transparent px-4 py-2 text-sm" value={level} onChange={(e) => go({ kind: e.target.value })}>
            <option value="county">Counties</option><option value="constituency">Constituencies</option>
          </select>
        </div>
        <AsyncView loaded={map}>
          {(data) => (
            <>
              <p className="mb-3 text-sm text-content-muted">{data.indicator.name ?? indicator}{data.indicator.unit ? ` (${data.indicator.unit})` : ""}. Click a place to open its page.</p>
              <StatMap data={data} onSelect={(path) => router.push(placeAt(path, "data/statistics"))} />
              <Gaps items={data.gaps} topic={data.indicator.name ?? indicator} />
            </>
          )}
        </AsyncView>
      </Section>
    </PageFrame>
  );
}

export default function StatisticsRoute() {
  return <Suspense><Explorer /></Suspense>;
}
