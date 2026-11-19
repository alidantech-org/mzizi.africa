/** Overview of a place: map and structure, plus what applies there. */
import { Landmark, MapPin, Scale, Vote } from "lucide-react";
import { Suspense } from "react";
import { EChart } from "#/components/echart";
import { GeoMap } from "#/components/geo-map";
import { Kpi, Panel } from "#/components/panel";
import { PlaceExplorer } from "#/components/place-explorer";
import { Applies } from "#/components/applies";
import { PageHeader, RealTag } from "#/components/ui";
import { ScaleLegend, TileMap } from "#/components/viz";
import chapters from "#/data/generated/constitution/index.json";
import population from "#/data/generated/population.json";
import { counties, otherCountry, totals } from "#/data/places";
import { axis, grid, palette, valueAxis } from "#/lib/chart";
import { compact } from "#/lib/format";
import { stepFor } from "#/lib/scale";
import type { Point } from "#/lib/partition";
import { placeName, type ViewProps } from "./types";

const wardsOf = (c: (typeof counties)[number]) => c.constituencies.reduce((n, k) => n + k.wards.length, 0);

async function KenyaPlace({ ctx, place }: ViewProps) {
  const county = place.county!;
  const geo = (await import(`../data/generated/county-geo/${county.slug}.json`)).default as { width: number; height: number; d: string; rings: Point[][] };
  return (
    <>
      <PageHeader eyebrow={`${place.level} · ${place.countryName}`} title={placeName(place)}>Select a part of the map to move inside this place. Your subject stays selected.</PageHeader>
      <Suspense fallback={<div className="h-[600px] animate-pulse rounded-xl bg-surface" />}>
        <PlaceExplorer county={county} geo={geo} constituencySlug={place.constituency?.slug} wardSlug={place.ward?.slug} />
      </Suspense>
      <div className="mt-6"><Applies place={place} ctx={ctx} /></div>
    </>
  );
}

export async function Overview(props: ViewProps) {
  const { place } = props;
  if (place.country === "ke" && place.county) return <KenyaPlace {...props} />;
  if (place.country === "ke") {
    const kenya = population.KEN;
    const latest = kenya.at(-1)!;
    const wardCounts = counties.map(wardsOf);
    const [min, max] = [Math.min(...wardCounts), Math.max(...wardCounts)];
    const fills = Object.fromEntries(counties.map((c) => [c.slug, stepFor(wardsOf(c), min, max)]));
    const titles = Object.fromEntries(counties.map((c) => [c.slug, `${wardsOf(c)} wards`]));
    return (
      <>
        <PageHeader eyebrow="Country · Kenya" title="Kenya, county by county">{totals.counties} counties, {totals.constituencies} constituencies and {totals.wards.toLocaleString("en")} wards. Select a county to move inside it.</PageHeader>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi label={`Population ${latest.year}`} value={compact(latest.value)} delta="World Bank series" tone="c1" icon={MapPin} />
          <Kpi label="Constituencies" value={String(totals.constituencies)} delta={`in ${totals.counties} counties`} tone="c2" icon={Vote} />
          <Kpi label="Wards" value={totals.wards.toLocaleString("en")} delta="smallest electoral unit" tone="c3" icon={Landmark} />
          <Kpi label="Constitution" value={String(chapters.reduce((n, c) => n + c.articles, 0))} delta={`articles in ${chapters.length} chapters`} tone="c4" icon={Scale} />
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
          <Panel title="County map" note="Shaded by number of wards" icon={MapPin}><GeoMap fills={fills} titles={titles} /><div className="mt-2 flex items-center justify-between"><RealTag>Boundaries: geoBoundaries</RealTag><span className="font-mono text-[11px] text-muted">{min} to {max} wards</span></div></Panel>
          <div className="grid gap-4">
            <Panel title="Constituencies per county" note="Tile map" icon={Vote}><TileMap values={Object.fromEntries(counties.map((c) => [c.code, c.constituencies.length]))} /><ScaleLegend /></Panel>
            <Panel title="Population growth" note="World Bank"><EChart height={220} width={420} label="Population of Kenya since 1960" option={{ grid, xAxis: { type: "category", data: kenya.map((p) => p.year), ...axis, axisLabel: { color: palette.muted, interval: 9 } }, yAxis: { ...valueAxis, axisLabel: { color: palette.muted, formatter: "{value}M" } }, series: [{ type: "line", symbol: "none", data: kenya.map((p) => Math.round(p.value / 1e5) / 10), lineStyle: { width: 3 }, areaStyle: { opacity: 0.12 } }] }} /></Panel>
          </div>
        </div>
        <div className="mt-6"><Applies place={place} ctx={props.ctx} /></div>
      </>
    );
  }
  const oc = otherCountry(place.country)!;
  const region = place.trail[0];
  const fills = Object.fromEntries(oc.regions.map((r, i) => [r.slug, `var(--scale-${(i * 3) % 4 + 1})`]));
  const pop = (population as Record<string, { year: number; value: number }[]>)[oc.iso];
  return (
    <>
      <PageHeader eyebrow={region ? `${oc.level} · ${oc.name}` : `Country · ${oc.name}`} title={region ? placeName(place) : oc.name}>Only first-level {oc.level.toLowerCase()}s and a population series are loaded for {oc.name}. Other subjects stay in the sidebar and will fill in as data is added.</PageHeader>
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <Panel title={`${oc.level}s`} note={`${oc.regions.length}`} icon={MapPin}><GeoMap country={oc.code} fills={fills} selected={region?.slug} /></Panel>
        <Panel title="Population" note="World Bank"><RealTag>CC BY 4.0</RealTag>
          <EChart height={300} width={420} label={`Population of ${oc.name} since 1960`} option={{ grid, xAxis: { type: "category", data: pop.map((p) => p.year), ...axis, axisLabel: { color: palette.muted, interval: 9 } }, yAxis: { ...valueAxis, axisLabel: { color: palette.muted, formatter: "{value}M" } }, series: [{ type: "line", symbol: "none", data: pop.map((p) => Math.round(p.value / 1e5) / 10), lineStyle: { width: 3 }, areaStyle: { opacity: 0.12 } }] }} /></Panel>
      </div>
    </>
  );
}
