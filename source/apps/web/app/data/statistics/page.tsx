/** Route `/data/statistics`: the country's statistics. Pick a measure and a level; the map and the ranking follow. A server page; the pickers are a client leaf. */
import { StatControls } from "#/components/site/stat-controls.tsx";
import { StatMap } from "#/components/site/stat-map.tsx";
import { LineChart } from "#/components/site/ui/charts.tsx";
import { Loaded } from "#/components/site/loaded.tsx";
import { Breadcrumbs, Gaps, PageFrame, Section, Stat } from "#/components/site/ui/primitives.tsx";
import { loadContext } from "#/lib/server/data.ts";
import { n, short } from "#/lib/site/format.ts";
import { T } from "#/lib/site/i18n.tsx";
import { browse, indicatorByRole, mapOf, metrics, seriesOf, statisticsOf } from "#/lib/site/insights.ts";

export const dynamic = "force-dynamic";

/** The levels the explorer maps; each is a kind of place the API can map. */
const LEVELS = [{ code: "county", title: "Counties" }, { code: "constituency", title: "Constituencies" }] as const;

export default async function StatisticsRoute({ searchParams }: { searchParams: Promise<{ indicator?: string; kind?: string }> }) {
  const q = await searchParams;
  const country = (await loadContext())?.country.name ?? "";
  const level = q.kind ?? LEVELS[0].code;
  return (
    <PageFrame wide>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Statistics" }]} />
      <p className="kicker">{country} <T>{"in numbers"}</T></p>
      <h1 className="hero-title text-4xl sm:text-5xl"><T>{"Statistics"}</T></h1>
      <p className="mt-2 max-w-2xl text-content-muted"><T>{"Population, health, education, poverty, water and openness: for the whole country, every county, constituency and ward, and for towns and villages where they are recorded."}</T></p>
      <Loaded read={async () => {
        const b = await browse();
        if (!b.place) throw new Error("The country is not recorded.");
        const stats = await statisticsOf(b.place.featureId);
        const population = indicatorByRole(stats, "population");
        const extra = (["density", "area"] as const).flatMap((role) => { const i = indicatorByRole(stats, role); return i ? [{ code: i.code, title: i.name }] : []; });
        const others = (await metrics().catch(() => ({ metrics: [] }))).metrics.filter((m) => m.domain === "statistics" && m.code !== population?.code && !extra.some((e) => e.code === m.code)).map((m) => ({ code: m.code, title: m.title }));
        const choices = [...(population ? [{ code: population.code, title: population.name }] : []), ...extra, ...others];
        const indicator = q.indicator ?? population?.code ?? choices[0]?.code ?? "";
        const [series, map] = await Promise.all([population ? seriesOf(population.code, b.place.featureId).catch(() => null) : null, indicator ? mapOf(indicator, undefined, level) : null]);
        return { counties: b.children.length, series, map, choices, indicator };
      }}>
        {({ counties, series, map, choices, indicator }) => (
          <>
            {series ? (
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <Stat label="Population (latest)" value={short(series.points.at(-1)?.value)} hint={`${series.points.at(-1)?.period.slice(0, 4)} · ${n(series.points.at(-1)?.value)} people`} />
                <Stat label="Counties" value={String(counties)} hint="Each with its own statistics page" />
                <div className="glass card md:col-span-1"><p className="text-xs font-semibold uppercase tracking-wide text-content-muted">Population over time</p><LineChart points={series.points} label={`${country}'s population over time`} height={120} /></div>
              </div>
            ) : null}
            <Section kicker="Explore" title="Compare places on a map">
              <StatControls indicator={indicator} level={level} choices={choices} levels={LEVELS} />
              {map ? (
                <>
                  <p className="mb-3 text-sm text-content-muted">{map.indicator.name ?? indicator}{map.indicator.unit ? ` (${map.indicator.unit})` : ""}. Click a place to open its page.</p>
                  <StatMap data={map} section="data/statistics" />
                  <Gaps items={map.gaps} topic={map.indicator.name ?? indicator} />
                </>
              ) : null}
            </Section>
          </>
        )}
      </Loaded>
    </PageFrame>
  );
}
