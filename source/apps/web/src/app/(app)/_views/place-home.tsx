/**
 * The home view of a place: headline figures, a map of the places inside it, who lives there, and the places inside.
 * Each region loads on its own, so the heading and the fast regions paint first.
 */
import { BarChart3, MapPin, Ruler, Users, Vote } from "lucide-react";
import { Suspense } from "react";
import { copy } from "@mzizi/copy";
import type { ExplorerLocation, InsightsPlaceStatistics } from "@mzizi/api-client";
import { ShareBars } from "#/components/place/share-bars";
import { ShapeMap } from "#/components/maps/shape-map";
import { EChart } from "#/components/charts/echart";
import { Kpi, Panel } from "#/components/ui/panel";
import { PageHeader } from "#/components/ui/page-header";
import { SkeletonPanel } from "#/components/ui/skeleton";
import Link from "#/components/navigation/demo-link";
import { axis, grid, valueAxis } from "#/lib/charts/chart";
import { stepFor } from "#/lib/charts/scale";
import { change, compact, int, pct } from "#/lib/formatting/format";
import { loadLocation, loadMap, loadStatistics, type PlaceAddress } from "#/lib/server/views/place-home";
import { getCopy } from "#/lib/server/copy";

type Indicator = InsightsPlaceStatistics["topics"][number]["indicators"][number];
const byRole = (stats: InsightsPlaceStatistics | null, role: string): Indicator | undefined =>
  stats?.topics.flatMap((t) => t.indicators).find((i) => i.role === role);
const year = (period: string) => new Date(period).getUTCFullYear();

export default async function PlaceHome({ address, language }: { address: PlaceAddress; language: string }) {
  const t = await getCopy(language);
  // Started together; each region below awaits only what it needs.
  const location = loadLocation(address, language);
  const statistics = loadStatistics(address, language);
  const map = loadMap(address, language);
  const loc = await location;
  if (!loc) return <p className="text-sm text-muted">{t(copy.place.empty.unavailable)}</p>;
  const place = loc.context.place;
  const eyebrow = place.parentName
    ? t(copy.place.eyebrow, { kind: place.kind, parent: place.parentName })
    : t(copy.place.eyebrowCountry, { kind: place.kind });

  return (
    <>
      <PageHeader eyebrow={eyebrow} title={place.name} />
      <Suspense fallback={<SkeletonPanel height={120} />}>
        <Figures statistics={statistics} language={language} t={t} />
      </Suspense>
      <div className="mt-4 grid grid-cols-1 items-start gap-2 sm:gap-4 lg:grid-cols-2">
        <Suspense fallback={<SkeletonPanel height={420} />}>
          <MapRegion map={map} loc={loc} language={language} t={t} />
        </Suspense>
        <Suspense fallback={<SkeletonPanel height={420} />}>
          <People statistics={statistics} placeName={place.name} language={language} t={t} />
        </Suspense>
      </div>
      <Inside loc={loc} map={map} language={language} t={t} />
    </>
  );
}

type T = Awaited<ReturnType<typeof getCopy>>;

async function Figures({ statistics, language, t }: { statistics: Promise<InsightsPlaceStatistics | null>; language: string; t: T }) {
  const stats = await statistics;
  const tiles = [
    { role: "population", label: t(copy.place.kpi.population), icon: Users, tone: "c1" as const, text: (v: number) => compact(v, language) },
    { role: "area", label: t(copy.place.kpi.area), icon: Ruler, tone: "c2" as const, text: (v: number) => `${int(v, language)} km²` },
    { role: "density", label: t(copy.place.kpi.density), icon: BarChart3, tone: "c3" as const, text: (v: number) => int(v, language) },
    { role: "registered-voters", label: t(copy.place.kpi.voters), icon: Vote, tone: "c4" as const, text: (v: number) => compact(v, language) },
  ];
  const shown = tiles.flatMap((tile) => {
    const ind = byRole(stats, tile.role);
    return ind ? [{ tile, ind }] : [];
  });
  if (!shown.length) return <p className="rounded-lg border border-dashed border-muted p-3 text-sm sm:p-6 text-muted">{t(copy.place.empty.statistics)}</p>;
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
      {shown.map(({ tile, ind }) => {
        const prev = ind.previous ? year(ind.previous.period) : null;
        const delta =
          ind.change != null && prev !== null
            ? t(copy.place.kpi.since, { change: change(ind.change, language), year: prev })
            : t(copy.place.kpi.asOf, { year: year(ind.latest.period) });
        return (
          <Kpi
            key={tile.role}
            label={tile.label}
            value={tile.text(ind.latest.value)}
            delta={ind.latest.estimated ? t(copy.place.kpi.estimated, { text: delta }) : delta}
            tone={tile.tone}
            icon={tile.icon}
          />
        );
      })}
    </div>
  );
}

async function MapRegion({
  map,
  loc,
  language,
  t,
}: {
  map: ReturnType<typeof loadMap>;
  loc: ExplorerLocation;
  language: string;
  t: T;
}) {
  const drawn = await map;
  const place = loc.context.place;
  if (!drawn) {
    return (
      <Panel id="map" title={t(copy.place.map.titleSelf, { place: place.name })} icon={MapPin}>
        <p className="text-sm text-muted">{t(copy.place.map.none)}</p>
      </Panel>
    );
  }
  const pops = drawn.map.shapes.map((s) => s.population).filter((v): v is number => v !== null);
  const lo = Math.min(...pops, 0);
  const hi = Math.max(...pops, 1);
  const fills: Record<string, string> = {};
  const titles: Record<string, string> = {};
  for (const s of drawn.map.shapes) {
    fills[s.address] = s.population !== null ? stepFor(s.population, lo, hi) : "var(--line)";
    if (s.population !== null) titles[s.address] = `${compact(s.population, language)} · ${t(copy.place.children.count, { count: s.childCount })}`;
  }
  return (
    <Panel
      id="map"
      title={drawn.self ? t(copy.place.map.titleSelf, { place: place.name }) : t(copy.place.map.title, { place: place.name })}
      note={drawn.self || !pops.length ? t(copy.place.map.noteOutline) : t(copy.place.map.noteShaded)}
      icon={MapPin}
    >
      <ShapeMap map={drawn.map} fills={fills} titles={titles} selected={drawn.self ? drawn.map.shapes[0]?.address : undefined} label={t(copy.place.map.group, { place: place.name })} />
      {!drawn.self && pops.length > 0 && (
        <div className="mt-3 flex items-center gap-2 text-xs text-muted">
          <span>{t(copy.place.map.lowest)}</span>
          <span aria-hidden className="flex h-2.5 flex-1 overflow-hidden rounded-full">
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className="flex-1" style={{ background: `var(--scale-${i})` }} />
            ))}
          </span>
          <span>{t(copy.place.map.highest)}</span>
        </div>
      )}
      {drawn.withoutBoundary > 0 && <p className="mt-2 text-xs text-muted">{t(copy.place.map.withoutBoundary, { count: drawn.withoutBoundary })}</p>}
    </Panel>
  );
}

async function People({
  statistics,
  placeName,
  language,
  t,
}: {
  statistics: Promise<InsightsPlaceStatistics | null>;
  placeName: string;
  language: string;
  t: T;
}) {
  const stats = await statistics;
  if (!stats) return null;
  const b = {
    age: stats.breakdowns.age ?? [],
    sex: stats.breakdowns.sex ?? [],
    residence: stats.breakdowns.residence ?? [],
    language: stats.breakdowns.language ?? [],
    community: stats.breakdowns.community ?? [],
  };
  const share = (s: number) => pct(s * 100, language);
  const block = (title: string, rows: { label: string; share: number }[]) =>
    rows.length ? (
      <div key={title}>
        <h3 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted">{title}</h3>
        <ShareBars rows={rows} format={share} label={t(copy.place.people.chart, { what: title, place: placeName })} />
      </div>
    ) : null;
  const top = (rows: { label: string; share: number }[]) => [...rows].sort((x, y) => y.share - x.share).slice(0, 6);
  const hasAny = b.age.length || b.sex.length || b.residence.length || b.language.length || b.community.length;
  if (!hasAny) return null;
  return (
    <Panel id="people" title={t(copy.place.people.title)} note={t(copy.place.people.note)} icon={Users}>
      {b.age.length > 0 && (
        <div className="mb-5">
          <h3 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted">{t(copy.place.people.age)}</h3>
          <EChart
            label={t(copy.place.people.chart, { what: t(copy.place.people.age), place: placeName })}
            height={220}
            option={{
              grid,
              xAxis: { type: "category", data: b.age.map((a) => a.label), ...axis, axisLabel: { ...axis.axisLabel, interval: 0, rotate: 45, fontSize: 10 } },
              // Static options only (a cached chart cannot take functions): values are in thousands and the axis says so.
              yAxis: { ...valueAxis, name: "× 1,000", nameTextStyle: { fontSize: 10 }, splitNumber: 3 },
              series: [{ type: "bar", barWidth: "60%", data: b.age.map((a) => Math.round(a.value / 1000)) }],
            }}
          />
        </div>
      )}
      <div className="space-y-5">
        {block(t(copy.place.people.sex), b.sex)}
        {block(t(copy.place.people.residence), b.residence)}
        {block(t(copy.place.people.languages), top(b.language))}
        {block(t(copy.place.people.communities), top(b.community))}
      </div>
    </Panel>
  );
}

async function Inside({ loc, map, language, t }: { loc: ExplorerLocation; map: ReturnType<typeof loadMap>; language: string; t: T }) {
  const group = loc.groups.at(-1);
  const children = group?.children ?? [];
  const drawn = await map;
  const pop = new Map(drawn?.map.shapes.map((s) => [s.address, s.population]) ?? []);
  return (
    <div className="mt-4">
      <Panel id="inside" title={t(copy.place.children.title)} note={children.length ? t(copy.place.children.count, { count: group?.total ?? children.length }) : undefined} icon={MapPin}>
        {!children.length ? (
          <p className="text-sm text-muted">{t(copy.place.children.none)}</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left font-mono text-[10px] uppercase tracking-widest text-muted">
                <th className="py-2 pr-4 font-normal">{t(copy.place.children.name)}</th>
                <th className="hidden py-2 pr-4 font-normal sm:table-cell">{t(copy.place.children.kind)}</th>
                <th className="py-2 text-right font-normal">{t(copy.place.children.population)}</th>
              </tr>
            </thead>
            <tbody>
              {children.map((c) => (
                <tr key={c.canonicalPath} className="border-t border-line">
                  <td className="max-w-0 truncate py-2 pr-4">
                    <Link href={c.canonicalPath} className="text-accent hover:underline">
                      {c.name}
                    </Link>
                  </td>
                  <td className="hidden truncate py-2 pr-4 text-muted sm:table-cell">{c.kind}</td>
                  <td className="py-2 text-right font-mono text-xs">{pop.get(c.canonicalPath) != null ? int(pop.get(c.canonicalPath)!, language) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
    </div>
  );
}
