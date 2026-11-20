/** Statistics explorer. County figures are demo values; population is the World Bank series. */
import Link from "#demo/_components/navigation/demo-link";
import { Suspense } from "react";
import { EChart } from "#demo/_components/visualization/echart";
import { GeoMap } from "#demo/_components/visualization/geo-map";
import { Kpi, Panel } from "#demo/_components/ui/panel";
import { DemoTag, PageHeader, RealTag } from "#demo/_components/ui/primitives";
import { ScaleLegend } from "#demo/_components/visualization/viz";
import { countyDemo, indicators } from "#demo/_data/demo";
import population from "#demo/_data/generated/population.json";
import { countyShapes } from "#demo/_data/places";
import { axis, grid, palette, valueAxis } from "#demo/_lib/charts/chart";
import { compact } from "#demo/_lib/formatting/format";
import { build } from "#demo/_lib/navigation/route";
import { placeName, type ViewProps } from "#demo/_view/shared/types";
import { stepFor } from "#demo/_lib/charts/scale";
import { box, median, regression } from "#demo/_lib/charts/stats";
import { BarChart3, Gauge, TrendingDown, TrendingUp } from "lucide-react";

function Body({ ctx, place }: ViewProps) {
  const i = ctx.params["view.indicator"];
  const mine = place.county ? countyDemo.find((c) => c.slug === place.county!.slug) : undefined;
  const ind = indicators.find((x) => x.id === i) ?? indicators[0];
  const vals = countyDemo.map((c) => c.values[ind.id]);
  const [min, max] = [Math.min(...vals), Math.max(...vals)];
  const ranked = [...countyDemo].sort((a, b) => b.values[ind.id] - a.values[ind.id]);
  const fills = Object.fromEntries(countyDemo.map((c) => [c.slug, stepFor(c.values[ind.id], min, max)]));
  const titles = Object.fromEntries(countyDemo.map((c) => [c.slug, `${c.values[ind.id]}${ind.unit}`]));
  const top = ranked.slice(0, 10);
  const bins = Array.from({ length: 10 }, (_, k) => 10 * k);
  const hist = bins.map((b) => vals.filter((v) => v >= b && v < b + 10).length);
  const shape = new Map(countyShapes.shapes.map((s) => [s.code, s]));
  const area = (code: string) => {
    const s = shape.get(code)!;
    return `${s.cy < countyShapes.height / 2 ? "North" : "South"} ${s.cx < countyShapes.width / 2 ? "west" : "east"}`;
  };
  const groups = ["North west", "North east", "South west", "South east"]
    .map((g) => ({ g, v: countyDemo.filter((c) => area(c.code).toLowerCase() === g.toLowerCase()).map((c) => c.values[ind.id]) }))
    .filter((x) => x.v.length > 3);
  const boxes = groups.map((x) => box(x.v));
  const other = indicators.find((x) => x.id === (ind.id === "water" ? "literacy" : "water"))!;
  const pts = countyDemo.map((c) => [c.values[ind.id], c.values[other.id], c.population / 1e5, c.name] as const);
  const reg = regression(pts.map((p) => [p[0], p[1]]));
  const kenya = population.KEN;
  const trend = regression(kenya.slice(-25).map((p) => [p.year, p.value / 1e6]));
  const proj = Array.from({ length: 16 }, (_, k) => 2025 + k).map((y) => ({ y, v: trend.slope * y + trend.intercept }));
  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        {indicators.map((x) => (
          <Link
            key={x.id}
            href={build(ctx, { params: { "view.indicator": x.id } })}
            scroll={false}
            className={`rounded-full border px-4 py-2 text-sm transition ${x.id === ind.id ? "border-transparent bg-accent text-paper" : "border-line bg-surface hover:border-muted"}`}
          >
            {x.label}
          </Link>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="National" value={`${ind.national}${ind.unit}`} delta={ind.label} tone="c1" icon={Gauge} />
        <Kpi
          label="Median county"
          value={`${Math.round(median(vals))}${ind.unit}`}
          delta="across 47 counties"
          tone="c2"
          icon={BarChart3}
        />
        <Kpi
          label="Highest"
          value={ranked[0].name}
          delta={`${ranked[0].values[ind.id]}${ind.unit}`}
          tone="c3"
          icon={TrendingUp}
        />
        <Kpi
          label="Lowest"
          value={ranked.at(-1)!.name}
          delta={`${ranked.at(-1)!.values[ind.id]}${ind.unit}`}
          tone="c4"
          icon={TrendingDown}
        />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Map by county" note={ind.label}>
          <div className="mb-2">
            <DemoTag />
          </div>
          <GeoMap fills={fills} titles={titles} selected={place.county?.slug} />
          <ScaleLegend low="Lower" high="Higher" />
        </Panel>
        <Panel title="Top ten counties" note="Ranking">
          <EChart
            height={470}
            width={520}
            label={`Ranking of the top ten counties by ${ind.label}`}
            option={{
              grid: { ...grid, left: 90, right: 40 },
              xAxis: { ...valueAxis, max: 100 },
              yAxis: { type: "category", data: top.map((c) => c.name), inverse: true, ...axis },
              series: [
                {
                  type: "bar",
                  barWidth: 5,
                  itemStyle: { color: palette.series[1], borderRadius: 4 },
                  data: top.map((c) => c.values[ind.id]),
                  markLine: {
                    silent: true,
                    symbol: "none",
                    lineStyle: { color: palette.ink, type: "dashed" },
                    label: { show: false },
                    data: [{ xAxis: ind.national }],
                  },
                },
                {
                  type: "scatter",
                  symbolSize: 14,
                  itemStyle: { color: palette.series[1] },
                  data: top.map((c) => c.values[ind.id]),
                  label: { show: true, position: "right", color: palette.ink, formatter: "{c}%" },
                },
              ],
            }}
          />
        </Panel>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="How counties are spread" note="Histogram">
          <EChart
            label="Histogram of counties by value"
            option={{
              grid,
              xAxis: { type: "category", data: bins.map((b) => `${b}–${b + 9}`), ...axis },
              yAxis: valueAxis,
              series: [
                {
                  type: "bar",
                  data: hist,
                  barWidth: "78%",
                  itemStyle: { color: palette.series[1], borderRadius: [5, 5, 0, 0] },
                  markLine: {
                    silent: true,
                    symbol: "none",
                    lineStyle: { color: palette.series[0] },
                    label: { formatter: "median" },
                    data: [{ xAxis: Math.floor(median(vals) / 10) }],
                  },
                },
              ],
            }}
          />
        </Panel>
        <Panel title="Spread within each area" note="Box plots">
          <EChart
            label="Box plot of county values by area of the map"
            option={{
              grid: { ...grid, left: 90 },
              xAxis: valueAxis,
              yAxis: { type: "category", data: groups.map((g) => g.g), ...axis },
              series: [
                {
                  type: "boxplot",
                  data: boxes.map((b) => b.row),
                  itemStyle: { color: palette.surface, borderColor: palette.series[1], borderWidth: 2 },
                },
                {
                  type: "scatter",
                  itemStyle: { color: palette.series[0] },
                  data: boxes.flatMap((b, k) => b.outliers.map((o) => [o, k])),
                },
              ],
            }}
          />
          <p className="mt-2 text-xs text-muted">Areas are quadrants of the real county map, not official regions.</p>
        </Panel>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title={`${ind.label} and ${other.label.toLowerCase()} together`} note="Bubble chart">
          <EChart
            label="Bubble chart of two indicators, sized by population"
            option={{
              grid: { ...grid, left: 50 },
              xAxis: { ...valueAxis, name: ind.label, nameLocation: "middle", nameGap: 26, min: 0, max: 100 },
              yAxis: { ...valueAxis, name: other.label, min: 0, max: 100 },
              series: [
                {
                  type: "scatter",
                  symbolSize: 12,
                  itemStyle: { color: palette.series[3], opacity: 0.55, borderColor: palette.series[3] },
                  data: pts.map((p) => [p[0], p[1]]),
                },
                {
                  type: "line",
                  symbol: "none",
                  lineStyle: { color: palette.ink, width: 2 },
                  data: [
                    [0, reg.intercept],
                    [100, reg.slope * 100 + reg.intercept],
                  ],
                },
              ],
            }}
          />
        </Panel>
        <Panel title="Where population is heading" note="World Bank + trend">
          <div className="mb-2 flex gap-2">
            <RealTag>Observed 1960–2025</RealTag>
            <DemoTag>Trend projection</DemoTag>
          </div>
          <EChart
            label="Population of Kenya with a simple trend projection to 2040"
            option={{
              grid,
              xAxis: {
                type: "category",
                data: [...kenya.map((p) => p.year), ...proj.slice(1).map((p) => p.y)],
                ...axis,
                axisLabel: { color: palette.muted, interval: 9 },
              },
              yAxis: { ...valueAxis, axisLabel: { color: palette.muted, formatter: "{value}M" } },
              series: [
                { type: "line", symbol: "none", lineStyle: { width: 3 }, data: kenya.map((p) => Math.round(p.value / 1e5) / 10) },
                {
                  type: "line",
                  symbol: "none",
                  lineStyle: { width: 3, type: "dashed", color: palette.series[0] },
                  itemStyle: { color: palette.series[0] },
                  data: [
                    ...kenya.slice(0, -1).map(() => "-"),
                    Math.round(kenya.at(-1)!.value / 1e5) / 10,
                    ...proj.slice(1).map((p) => Math.round(p.v * 10) / 10),
                  ],
                },
              ],
            }}
          />
          <p className="mt-2 text-xs text-muted">
            Dashed line extends the last 25 years in a straight line to 2040: {compact(proj.at(-1)!.v * 1e6)}. It is a trend, not
            a forecast.
          </p>
        </Panel>
      </div>
    </>
  );
}

export function Statistics({ ctx, place, lang }: ViewProps) {
  const deep = place.trail.length > 1;
  return (
    <>
      <PageHeader eyebrow={`Statistics · ${placeName(place)}`} title="Statistics explorer">
        Pick an indicator and read it on a map, a ranking and several distributions. County figures are demo values until a
        statistics source is loaded.
      </PageHeader>
      {place.county && (
        <div className="mb-5 rounded-lg border border-line bg-surface p-4 text-sm">
          <b>{place.county.name}</b> is highlighted on the map.{" "}
          {deep
            ? `No ${place.level.toLowerCase()}-level figures are loaded, so the county figure applies here (scope: county).`
            : "These figures are for the whole county."}
        </div>
      )}
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-surface" />}>
        <Body ctx={ctx} place={place} lang={lang} />
      </Suspense>
    </>
  );
}
