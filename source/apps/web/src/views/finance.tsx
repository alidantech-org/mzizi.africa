import { placeName, type ViewProps } from "./types";
/** Public money for one county. Every figure here is a demo value until budget sources are loaded. */
import { Coins, PiggyBank, Users, Wallet } from "lucide-react";
import { EChart } from "#/components/echart";
import { Kpi, Panel } from "#/components/panel";
import { DemoTag, PageHeader } from "#/components/ui";
import nairobi from "#/data/generated/county-geo/nairobi.json";
import { countyBySlug } from "#/data/places";
import { grid, axis, valueAxis, legend, palette } from "#/lib/chart";
import { partition, pathOf, type Point } from "#/lib/partition";

const sectors = [["Health", 28], ["Education", 18], ["Roads and transport", 16], ["Administration", 12], ["Water and sanitation", 11], ["Other", 8], ["Agriculture", 7]] as const;
const sc = palette.series;
const sectorColor = [sc[1], sc[3], sc[2], palette.muted, sc[0], palette.line, sc[4]];
const years = ["2022", "2023", "2024", "2025", "2026"];

const tenders = [["Market rehabilitation", "Awarded", "KSh 120M", "Supplier A Ltd", 82], ["Clinic extension", "Open", "KSh 64M", "Not yet awarded", 45], ["Drainage works", "Closed", "KSh 210M", "Under evaluation", 60], ["Road resurfacing", "Complete", "KSh 88M", "Supplier B Ltd", 96]] as const;

export async function Finance({ ctx, place }: ViewProps) {
  const county = place.county ?? countyBySlug("nairobi")!;
  const geo = (await import(`../data/generated/county-geo/${county.slug}.json`)).default as typeof nairobi;
  const cells = partition(geo.rings as Point[][], 7, `projects-${county.slug}`);
  const status = ["c2", "c3", "c1", "c2", "c3", "c2", "c1"];
  return (
    <>
      <PageHeader eyebrow={`Public money · ${placeName(place)}`} title="Where the money goes" actions={<DemoTag>Demo figures · {county.name}</DemoTag>}>{place.county ? (place.trail.length > 1 ? `The county fund of ${county.name} covers ${placeName(place)} (scope: county). ` : "") : "No county is selected, so the example county is shown. "}Distribution, flows and trends for one county. No budget source is loaded yet, so every figure below is a placeholder that proves the screen.</PageHeader>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Available" value="KSh 41.0B" delta="approved and grants" tone="c1" icon={Wallet} />
        <Kpi label="Spent" value="KSh 32.0B" delta="78% of available" tone="c2" icon={Coins} />
        <Kpi label="Per resident" value="KSh 9,300" delta="allocation ÷ population" tone="c3" icon={Users} />
        <Kpi label="Development share" value="42%" delta="of total spending" tone="c4" icon={PiggyBank} />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="How the fund is shared" note="Donut"><EChart height={340} width={520} label="Donut chart of the county allocation by sector" option={{ legend: { orient: "vertical", right: 0, top: "center", icon: "circle", textStyle: { color: palette.muted } }, series: [{ type: "pie", radius: ["52%", "76%"], center: ["32%", "50%"], padAngle: 2, itemStyle: { borderRadius: 8 }, label: { show: true, position: "center", formatter: "KSh 41B\ntotal fund", color: palette.ink, fontSize: 16, lineHeight: 22 }, data: sectors.map(([name, value], i) => ({ name, value, itemStyle: { color: sectorColor[i] } })) }] }} /></Panel>
        <Panel title="Largest projects" note="Treemap"><EChart height={340} width={520} label="Treemap of the largest projects, coloured by sector" option={{ series: [{ type: "treemap", roam: false, nodeClick: false, breadcrumb: { show: false }, width: "100%", height: "100%", itemStyle: { borderColor: palette.surface, borderWidth: 3, borderRadius: 6 }, label: { color: palette.surface, fontSize: 12, formatter: "{b}" }, data: [["Referral hospital wing", 90, 0], ["Primary school classrooms", 62, 1], ["Ring road upgrade", 74, 2], ["Water treatment", 51, 4], ["Market rehabilitation", 40, 2], ["Clinic extension", 34, 0], ["Drainage works", 44, 4], ["Digital registry", 22, 3], ["Youth centres", 18, 1]].map(([name, value, k]) => ({ name, value, itemStyle: { color: sectorColor[k as number] } })) }] }} /></Panel>
      </div>
      <Panel title="Where the money comes from and where it goes" note="Sankey, % of fund" className="mt-4"><EChart height={380} width={1000} label="Sankey diagram from funding source to spending class to sector" option={{ series: [{ type: "sankey", left: 10, right: 120, nodeWidth: 16, nodeGap: 14, lineStyle: { color: "source", opacity: 0.45, curveness: 0.5 }, label: { color: palette.ink }, itemStyle: { borderWidth: 0 },
        data: [["Equitable share", 0], ["Own-source revenue", 1], ["Grants", 2], ["Recurrent", 3], ["Development", 4], ["Health", 0], ["Education", 1], ["Roads", 2], ["Other", 4]].map(([name, k]) => ({ name, itemStyle: { color: sc[k as number] } })),
        links: [["Equitable share", "Recurrent", 30], ["Equitable share", "Development", 12], ["Own-source revenue", "Recurrent", 18], ["Own-source revenue", "Development", 8], ["Grants", "Development", 12], ["Grants", "Recurrent", 20], ["Recurrent", "Health", 28], ["Recurrent", "Education", 18], ["Recurrent", "Other", 22], ["Development", "Roads", 16], ["Development", "Health", 8], ["Development", "Other", 8]].map(([source, target, value]) => ({ source, target, value })) }] }} /></Panel>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="From approval to unspent" note="Waterfall, KSh billions"><EChart label="Waterfall chart from approved budget to unspent balance" option={{ grid, xAxis: { type: "category", data: ["Approved", "Supplementary", "Grants", "Available", "Personnel", "Operations", "Development", "Unspent"], ...axis, axisLabel: { color: palette.muted, fontSize: 10, interval: 0 } }, yAxis: valueAxis, series: [{ type: "bar", stack: "w", itemStyle: { color: "transparent" }, data: [0, 36, 38.5, 0, 31, 24, 14, 0] }, { type: "bar", stack: "w", barWidth: "62%", data: [{ value: 36, itemStyle: { color: palette.muted } }, { value: 2.5, itemStyle: { color: sc[1] } }, { value: 2.5, itemStyle: { color: sc[1] } }, { value: 41, itemStyle: { color: palette.muted } }, { value: 10, itemStyle: { color: sc[0] } }, { value: 7, itemStyle: { color: sc[0] } }, { value: 10, itemStyle: { color: sc[0] } }, { value: 9, itemStyle: { color: sc[3] } }] }] }} /></Panel>
        <Panel title="Funding by source over time" note="Stacked area"><EChart label="Stacked area chart of funding by source" option={{ legend, grid: { ...grid, top: 40 }, xAxis: { type: "category", data: years, boundaryGap: false, ...axis }, yAxis: valueAxis, series: [["Equitable share", [20, 22, 24, 26, 28], 1], ["Own-source revenue", [6, 7, 8, 9, 10], 3], ["Grants", [2, 3, 3, 4, 3], 2]].map(([name, data, k]) => ({ name, type: "line", stack: "f", symbol: "none", lineStyle: { width: 0 }, areaStyle: { opacity: 0.85, color: sc[k as number] }, itemStyle: { color: sc[k as number] }, data })) }} /></Panel>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="The procurement funnel" note="Planned tenders reaching each stage"><EChart height={320} width={520} label="Funnel of planned tenders through each procurement stage" option={{ series: [{ type: "funnel", left: "8%", width: "84%", gap: 3, minSize: "20%", label: { color: palette.surface, formatter: "{b} · {c}" }, itemStyle: { borderWidth: 0 }, data: [["Planned", 100], ["Published", 88], ["Bids received", 74], ["Awarded", 61], ["Contract signed", 55], ["Delivered", 38]].map(([name, value], i) => ({ name, value, itemStyle: { color: sc[1], opacity: 1 - i * 0.1 } })) }] }} /></Panel>
        <Panel title="What each ward group spends on" note="100% stacked"><EChart height={320} width={520} label="100 percent stacked bars of spending by class" option={{ legend, grid: { ...grid, left: 80, top: 40 }, xAxis: { type: "value", max: 100, splitLine: { lineStyle: { color: palette.line, type: "dashed" } }, axisLabel: { color: palette.muted } }, yAxis: { type: "category", data: ["Group A", "Group B", "Group C", "Group D", "Group E"], inverse: true, ...axis }, series: [["Personnel", [34, 38, 36, 33, 40], palette.muted], ["Operations", [20, 22, 18, 24, 17], sc[3]], ["Development", [38, 30, 36, 35, 33], sc[1]], ["Transfers", [8, 10, 10, 8, 10], sc[2]]].map(([name, data, color]) => ({ name, type: "bar", stack: "s", barWidth: 20, itemStyle: { color }, data })) }} /></Panel>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <Panel title="Projects on the map" note="Schematic positions">
          <svg viewBox={`0 0 ${geo.width} ${geo.height}`} className="w-full rounded-lg bg-paper" role="img" aria-label="Projects placed on the county outline">
            <path d={geo.d} fill="var(--scale-1)" stroke="var(--ink)" strokeOpacity=".4" strokeWidth="3" />
            {cells.map((c, i) => <g key={i}><path d={pathOf(c.polygon)} fill="none" stroke="var(--surface)" strokeWidth="2" opacity=".7" /><circle cx={c.centroid[0]} cy={c.centroid[1]} r="11" fill={`var(--${status[i]})`} stroke="var(--surface)" strokeWidth="3" /></g>)}
          </svg>
          <div className="mt-3 flex gap-4 text-xs text-muted">{[["On track", "c2"], ["Delayed", "c3"], ["Stalled", "c1"]].map(([l, c]) => <span key={l} className="flex items-center gap-2"><span className="size-2.5 rounded-full" style={{ background: `var(--${c})` }} />{l}</span>)}</div>
        </Panel>
        <Panel title="Tenders and contracts" note="Disclosure is how many fields a tender publishes"><div className="overflow-x-auto"><table className="w-full min-w-[520px] text-sm"><thead><tr className="text-left font-mono text-[10px] uppercase tracking-widest text-muted">{["Tender", "Status", "Value", "Supplier", "Disclosure"].map((h) => <th key={h} className="p-2.5">{h}</th>)}</tr></thead>
          <tbody>{tenders.map(([t, s, v, sup, d]) => <tr key={t} className="border-t border-line"><td className="p-2.5 font-medium">{t}</td><td className="p-2.5"><span className="rounded-full bg-line px-2.5 py-1 text-xs">{s}</span></td><td className="p-2.5 font-mono">{v}</td><td className="p-2.5 text-muted">{sup}</td><td className="p-2.5"><div className="h-2 w-24 rounded-full bg-line"><div className="h-full rounded-full bg-c2" style={{ width: `${d}%` }} /></div></td></tr>)}</tbody></table></div></Panel>
      </div>
    </>
  );
}
