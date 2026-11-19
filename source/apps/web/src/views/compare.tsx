/** Compare places side by side (demo county figures) and countries (World Bank population). */
import { Suspense } from "react";
import { EChart } from "#/components/echart";
import { Panel } from "#/components/panel";
import { PlacePicker } from "#/components/place-picker";
import { DemoTag, PageHeader, RealTag } from "#/components/ui";
import { cookies } from "next/headers";
import Link from "next/link";
import { indicators } from "#/data/demo";
import { build, type Place } from "#/lib/route";
import { entitiesAt, homeAt, KENYA_COUNTRIES, levelName, levelOf, nearest, top, valuesOf, type Entity } from "#/lib/compare";
import population from "#/data/generated/population.json";
import { placeName, type ViewProps } from "./types";
import { axis, grid, legend, palette, valueAxis } from "#/lib/chart";

/** The home place saved by onboarding, if any. */
async function readHome(): Promise<Place | null> {
  try { const raw = (await cookies()).get("mzizi-home")?.value; return raw ? (JSON.parse(decodeURIComponent(raw)) as Place) : null; } catch { return null; }
}

async function Body({ ctx, place }: ViewProps) {
  const at: Place = { country: ctx.country, trail: ctx.trail };
  const level = levelOf(at);
  const home = await readHome();
  const pool = entitiesAt(level, at);
  const here = pool.find((e) => JSON.stringify(e.place) === JSON.stringify(at));
  const homeEntity = (() => { const h = homeAt(level, home); return h ? pool.find((e) => e.place.country === h.country && e.place.trail.join("/") === h.trail.join("/")) : undefined; })();
  const requested = ctx.params["view.places"]?.split(",").filter((c) => pool.some((e) => e.code === c)).slice(0, 5);
  const picks: Entity[] = (requested?.length ? requested : (() => {
    const out: Entity[] = [];
    const add = (e?: Entity) => e && !out.some((x) => x.code === e.code) && out.length < 5 && out.push(e);
    add(here); add(homeEntity);
    if (here) nearest(here, pool, 2).forEach(add);
    top(pool, 2, out.map((x) => x.code)).forEach(add);
    return out.length ? out : pool.slice(0, 3);
  })().map((e) => e.code)).map((c) => pool.find((e) => e.code === c)!);
  const noun = levelName[level];
  const link = (codes: string[]) => build(ctx, { params: { ...ctx.params, "view.places": codes.join(",") } });
  const suggestions = [
    here && { label: `Nearest ${noun}s`, href: link([here.code, ...nearest(here, pool, 3).map((e) => e.code)]) },
    { label: "Top performers", href: link(top(pool, 4).map((e) => e.code)) },
    homeEntity && { label: "My region", href: link([homeEntity.code, ...(here && here.code !== homeEntity.code ? [here.code] : []), ...nearest(homeEntity, pool, 2).map((e) => e.code)]) },
  ].filter(Boolean) as { label: string; href: string }[];
  const palette5 = [palette.series[1], palette.series[2], palette.series[3], palette.series[0], palette.series[4]];
  const css = ["var(--c2)", "var(--c3)", "var(--c4)", "var(--c1)", "var(--c5)"];

  const picker = <PlacePicker options={pool.map((e) => ({ code: e.code, name: e.name, hint: e.parentName }))} selected={picks.map((p) => p.code)} colors={css} noun={noun} />;
  const head = (
    <div className="mb-4 space-y-3">
      <div className="flex flex-wrap items-center gap-4">{picker}{level !== "country" && <DemoTag />}</div>
      <div className="flex flex-wrap items-center gap-2 text-sm"><span className="text-muted">Comparing {noun}s with {noun}s. Suggestions:</span>
        {suggestions.map((s) => <Link key={s.label} href={s.href} className="rounded-md border border-line px-2.5 py-1 hover:bg-accent-soft">{s.label}</Link>)}</div>
    </div>
  );

  if (level === "country") {
    const series = (code: string) => { const c = KENYA_COUNTRIES.find((x) => x.code === code)!; return (population as Record<string, { year: number; value: number }[]>)[c.iso]; };
    const years = population.KEN.map((x) => x.year).filter((y) => y >= 1990);
    const last = (code: string) => series(code).at(-1)!.value;
    const growth = (code: string) => { const s = series(code); return Math.round(((s.at(-1)!.value / s.find((p) => p.year === 2000)!.value) - 1) * 100); };
    return (
      <>
        {head}
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Population, latest" note="Bar" icon={undefined}><RealTag>World Bank · CC BY 4.0</RealTag>
            <EChart height={300} width={520} label="Bar chart of population by country" option={{ grid: { ...grid, left: 80 }, xAxis: { ...valueAxis, axisLabel: { color: palette.muted, formatter: "{value}M" } }, yAxis: { type: "category", data: picks.map((p) => p.name), inverse: true, ...axis }, series: [{ type: "bar", barWidth: 22, data: picks.map((p, i) => ({ value: Math.round(last(p.code) / 1e5) / 10, itemStyle: { color: palette5[i], borderRadius: [0, 6, 6, 0] } })), label: { show: true, position: "right", color: palette.ink, formatter: "{c}M" } }] }} /></Panel>
          <Panel title="Growth since 2000" note="Percent"><EChart height={300} width={520} label="Bar chart of population growth since 2000" option={{ grid, xAxis: { type: "category", data: picks.map((p) => p.name), ...axis }, yAxis: { ...valueAxis, axisLabel: { color: palette.muted, formatter: "{value}%" } }, series: [{ type: "bar", barWidth: 40, data: picks.map((p, i) => ({ value: growth(p.code), itemStyle: { color: palette5[i], borderRadius: [6, 6, 0, 0] } })), label: { show: true, position: "top", color: palette.ink, formatter: "{c}%" } }] }} /></Panel>
        </div>
        <Panel title="Population since 1990" note="Lines" className="mt-4"><EChart height={320} width={900} label="Population of the selected countries since 1990" option={{ legend, grid: { ...grid, left: 56 }, xAxis: { type: "category", data: years, ...axis, axisLabel: { color: palette.muted, interval: 4 } }, yAxis: { ...valueAxis, axisLabel: { color: palette.muted, formatter: "{value}M" } }, series: picks.map((p, i) => ({ name: p.name, type: "line", symbol: "none", smooth: true, lineStyle: { width: 3, color: palette5[i] }, itemStyle: { color: palette5[i] }, data: series(p.code).filter((x) => x.year >= 1990).map((x) => Math.round(x.value / 1e5) / 10) })) }} /></Panel>
      </>
    );
  }
  if (!pool.length) return <p className="rounded-lg border border-dashed border-muted p-6 text-sm text-muted">No {noun}-level data is loaded for {place.countryName}, so there is nothing to compare at this level yet.</p>;

  const six = indicators.slice(0, 6);
  const vals = picks.map((p) => ({ p, v: valuesOf(p) }));
  return (
    <>
      {head}
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Overall profile" note="Radar"><EChart height={420} width={520} label={`Radar chart comparing ${noun}s across six measures`} option={{ legend, radar: { radius: "62%", indicator: six.map((x) => ({ name: x.label, max: 100 })), axisName: { color: palette.muted }, splitLine: { lineStyle: { color: palette.line } }, splitArea: { show: false }, axisLine: { lineStyle: { color: palette.line } } }, series: [{ type: "radar", symbol: "circle", symbolSize: 6, data: vals.map(({ p, v }, i) => ({ name: p.name, value: six.map((x) => v[x.id]), lineStyle: { color: palette5[i], width: 2.5 }, itemStyle: { color: palette5[i] }, areaStyle: { color: palette5[i], opacity: 0.1 } })) }] }} /></Panel>
        <Panel title="Grouped by indicator" note="Bars"><EChart height={420} width={520} label={`Grouped bar chart of indicators by ${noun}`} option={{ legend, grid: { ...grid, top: 40 }, xAxis: { type: "category", data: six.map((x) => x.label.replace("Skilled birth attendance", "Birth care")), ...axis, axisLabel: { color: palette.muted, interval: 0, fontSize: 10 } }, yAxis: { ...valueAxis, max: 100 }, series: vals.map(({ p, v }, i) => ({ name: p.name, type: "bar", barGap: "10%", itemStyle: { color: palette5[i], borderRadius: [4, 4, 0, 0] }, data: six.map((x) => v[x.id]) })) }} /></Panel>
      </div>
      <Panel title="Where each place stands against its target" note="Bullet bars" className="mt-4">
        <div className="grid gap-8 md:grid-cols-2">
          {indicators.filter((x) => x.target).slice(0, 4).map((x) => (
            <div key={x.id}><h3 className="mb-3 text-sm font-medium">{x.label} (target {x.target}%)</h3>
              <div className="space-y-3">{vals.map(({ p, v }, i) => (
                <div key={p.code} className="grid grid-cols-[84px_1fr_44px] items-center gap-3"><span className="truncate text-sm">{p.name}</span>
                  <div className="relative h-4 overflow-hidden rounded-full bg-line"><div className="absolute inset-y-1 left-0 rounded-full" style={{ width: `${v[x.id]}%`, background: css[i] }} /><div className="absolute inset-y-0 w-0.5 bg-ink" style={{ left: `${x.target}%` }} /></div>
                  <span className="text-right font-mono text-sm">{v[x.id]}%</span></div>
              ))}</div></div>
          ))}
        </div>
      </Panel>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <Panel title="Heat table against the national figure" note="Green is better than Kenya, red is worse">
          <div className="overflow-x-auto"><table className="w-full min-w-[480px] text-sm">
            <thead><tr className="text-left font-mono text-[10px] uppercase tracking-widest text-muted"><th className="p-2">Indicator</th>{picks.map((p) => <th key={p.code} className="p-2">{p.name}</th>)}<th className="p-2">Kenya</th></tr></thead>
            <tbody>{indicators.map((x) => <tr key={x.id} className="border-t border-line"><td className="p-2 font-medium">{x.label}</td>{vals.map(({ p, v }) => { const val = v[x.id]; const good = x.better === "high" ? val >= x.national : val <= x.national; return <td key={p.code} className="p-2 font-mono" style={{ background: `color-mix(in srgb, var(${good ? "--c2" : "--c1"}) ${Math.min(70, Math.abs(val - x.national) * 2.2)}%, transparent)` }}>{val}</td>; })}<td className="p-2 font-mono text-muted">{x.national}</td></tr>)}</tbody>
          </table></div>
        </Panel>
        <Panel title="Parallel view" note={`Grey lines are other ${noun}s`}><EChart height={380} width={420} label={`Parallel coordinates of ${noun}s across five measures`} option={{ parallelAxis: six.slice(0, 5).map((x, k) => ({ dim: k, name: x.label.slice(0, 12), min: 0, max: 100, nameTextStyle: { color: palette.muted, fontSize: 10 }, axisLine: { lineStyle: { color: palette.line } }, axisLabel: { color: palette.muted } })), parallel: { left: 30, right: 36, top: 56, bottom: 28 }, series: [{ type: "parallel", lineStyle: { width: 1, color: palette.line, opacity: 0.7 }, data: pool.slice(0, 150).map((e) => { const v = valuesOf(e); return six.slice(0, 5).map((x) => v[x.id]); }) }, ...vals.map(({ v }, i) => ({ type: "parallel" as const, lineStyle: { width: 3.5, color: palette5[i] }, data: [six.slice(0, 5).map((x) => v[x.id])] }))] }} /></Panel>
      </div>
    </>
  );
}

export function Compare({ ctx, place, lang }: ViewProps) {
  return (
    <>
      <PageHeader eyebrow={`Compare · ${placeName(place)}`} title="Compare places side by side">Places are always compared at the same level: counties with counties, wards with wards, countries with countries. Your current place and your home region are picked for you.</PageHeader>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-surface" />}><Body ctx={ctx} place={place} lang={lang} /></Suspense>
    </>
  );
}
