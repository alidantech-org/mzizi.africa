/**
 * The statistics view of a place: one topic at a time (`?topic=`), one card per indicator with its own trend, so
 * measures with different units are never drawn on the same chart.
 */
import { Suspense } from "react";
import { copy } from "@mzizi/copy";
import type { InsightsPlaceStatistics } from "@mzizi/api-client";
import { EChart } from "#/components/charts/echart";
import Link from "#/components/navigation/demo-link";
import { PageHeader } from "#/components/ui/page-header";
import { Panel } from "#/components/ui/panel";
import { SkeletonPanel } from "#/components/ui/skeleton";
import { axis, grid, valueAxis } from "#/lib/charts/chart";
import { change, compact, decimal } from "#/lib/formatting/format";
import { loadLocation, loadStatistics, type PlaceAddress } from "#/lib/server/views/place-home";
import { getCopy } from "#/lib/server/copy";

type T = Awaited<ReturnType<typeof getCopy>>;
type Indicator = InsightsPlaceStatistics["topics"][number]["indicators"][number];
const year = (period: string) => new Date(period).getUTCFullYear();

/** A value in the way its unit is written: percentages keep one decimal, large counts are shortened. */
const show = (v: number, unit: string, language: string) =>
  unit.includes("%") ? `${decimal(v, language)}%` : Math.abs(v) >= 10000 ? compact(v, language) : decimal(v, language, Math.abs(v) < 100 && !Number.isInteger(v) ? 1 : 0);

function Card({ ind, place, language, t }: { ind: Indicator; place: string; language: string; t: T }) {
  const prev = ind.previous ? year(ind.previous.period) : null;
  const delta =
    ind.change != null && prev !== null
      ? t(copy.place.kpi.since, { change: change(ind.change, language), year: prev })
      : t(copy.place.kpi.asOf, { year: year(ind.latest.period) });
  const points = ind.series.filter((p) => Number.isFinite(p.value));
  return (
    <div className="min-w-0 rounded-lg border border-line bg-surface p-2 sm:p-4">
      <div className="text-xs text-muted">{ind.name}</div>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
        <span className="font-display text-2xl tracking-tight">{show(ind.latest.value, ind.unit, language)}</span>
        {!ind.unit.includes("%") && <span className="text-xs text-muted">{ind.unit}</span>}
      </div>
      <div className="text-xs text-muted">{ind.latest.estimated ? t(copy.place.kpi.estimated, { text: delta }) : delta}</div>
      <div className="mt-2">
        {points.length > 1 ? (
          <EChart
            label={t(copy.place.stats.chart, { name: ind.name, place })}
            height={160}
            option={{
              grid,
              xAxis: { type: "category", data: points.map((p) => String(year(p.period))), ...axis },
              yAxis: { ...valueAxis, scale: true, splitNumber: 3 },
              series: [{ type: "line", smooth: false, symbolSize: 5, data: points.map((p) => p.value) }],
            }}
          />
        ) : (
          <p className="text-xs text-muted">{t(copy.place.stats.oneRecord)}</p>
        )}
      </div>
    </div>
  );
}

async function Topics({ address, statistics, topic, place, language, t }: { address: PlaceAddress; statistics: Promise<InsightsPlaceStatistics | null>; topic?: string; place: string; language: string; t: T }) {
  const stats = await statistics;
  if (!stats || !stats.topics.length) return <p className="rounded-lg border border-dashed border-muted p-2 text-sm text-muted sm:p-6">{t(copy.place.empty.statistics)}</p>;
  const current = stats.topics.find((x) => x.code === topic) ?? stats.topics[0]!;
  const base = `/${[address.country, ...address.trail].join("/")}?view=statistics`;
  return (
    <>
      <nav aria-label={t(copy.place.stats.topics)} className="mb-2 flex flex-wrap gap-1 sm:mb-4 sm:gap-2">
        {stats.topics.map((x) => (
          <Link
            key={x.code}
            href={`${base}&topic=${encodeURIComponent(x.code)}`}
            aria-current={x.code === current.code ? "true" : undefined}
            className={`rounded-md border px-2 py-1 text-sm ${x.code === current.code ? "border-accent bg-accent-soft font-medium text-ink" : "border-line text-muted hover:bg-accent-soft"}`}
          >
            {x.label}
          </Link>
        ))}
      </nav>
      <Panel id={current.code} title={current.label} note={t(copy.place.people.note)}>
        {current.indicators.length ? (
          <div className="grid gap-2 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
            {current.indicators.map((ind) => (
              <Card key={ind.code} ind={ind} place={place} language={language} t={t} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">{t(copy.place.stats.noTopic)}</p>
        )}
      </Panel>
    </>
  );
}

export default async function PlaceStatistics({ address, language, topic }: { address: PlaceAddress; language: string; topic?: string }) {
  const t = await getCopy(language);
  const statistics = loadStatistics(address, language);
  const loc = await loadLocation(address, language);
  if (!loc) return <p className="text-sm text-muted">{t(copy.place.empty.unavailable)}</p>;
  const place = loc.context.place;
  return (
    <>
      <PageHeader eyebrow={place.name} title={t(copy.place.stats.title)} />
      <Suspense fallback={<SkeletonPanel height={420} />}>
        <Topics address={address} statistics={statistics} topic={topic} place={place.name} language={language} t={t} />
      </Suspense>
    </>
  );
}
