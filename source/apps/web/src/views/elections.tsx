import { placeName, type ViewProps } from "./types";
/** Elections: winning party by county on a real map. Results are demo figures. */
import { ElectionMap } from "#/components/election-map";
import { EChart } from "#/components/echart";
import { Kpi, Panel } from "#/components/panel";
import { DemoTag, PageHeader } from "#/components/ui";
import { electionByCounty, parties } from "#/data/demo";
import { axis, grid, palette, valueAxis } from "#/lib/chart";
import { compact } from "#/lib/format";
import Link from "next/link";
import { build } from "#/lib/route";
import { Trophy, Users, Vote } from "lucide-react";

export function Elections({ ctx, place }: ViewProps) {
  const party = ctx.params["filters.party"];
  const sortBy = ctx.params["sort.by"] ?? "name";
  const dir = ctx.params["sort.dir"] === "desc" ? "desc" : "asc";
  const limit = Math.min(50, Math.max(5, Number(ctx.params["page.limit"]) || 12));
  const rows = electionByCounty.filter((c) => !party || c.winner === party).sort((a, b) => { const k = sortBy as "name" | "margin" | "turnout" | "registered"; const d = typeof a[k] === "number" ? (a[k] as number) - (b[k] as number) : String(a[k]).localeCompare(String(b[k])); return dir === "asc" ? d : -d; });
  const pages = Math.max(1, Math.ceil(rows.length / limit));
  const pageNo = Math.min(pages, Math.max(1, Number(ctx.params["page.no"]) || 1));
  const shown = rows.slice((pageNo - 1) * limit, pageNo * limit);
  const cols = [["name", "County"], ["winner", "Winner"], ["margin", "Margin"], ["turnout", "Turnout"], ["registered", "Registered"]] as const;
  const share = parties.map((p) => ({ ...p, n: electionByCounty.filter((c) => c.winner === p.id).length }));
  const registered = electionByCounty.reduce((n, c) => n + c.registered, 0);
  const turnout = Math.round(electionByCounty.reduce((n, c) => n + c.turnout, 0) / electionByCounty.length);
  const lead = [...share].sort((a, b) => b.n - a.n)[0];
  return (
    <>
      <PageHeader eyebrow={`Elections · ${placeName(place)}`} title="Winning party by county" actions={<DemoTag>Demo results</DemoTag>}>A contest read on the real county map. Darker means a wider margin. Select a county to open it. No election results are loaded yet.</PageHeader>
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <Kpi label="Registered voters" value={compact(registered)} delta="demo register" tone="c1" icon={Users} />
        <Kpi label="Turnout" value={`${turnout}%`} delta="of registered voters" tone="c2" icon={Vote} />
        <Kpi label="Most counties" value={lead.id} delta={`${lead.name} · ${lead.n} counties`} tone="c3" icon={Trophy} />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Panel title="Winning party by county" note="Presidential contest, demo"><ElectionMap selected={place.county?.slug} /></Panel>
        <Panel title="Counties won" note="Share of 47">
          <EChart height={260} width={420} label="Bar chart of counties won by party" option={{ grid: { ...grid, left: 50 }, xAxis: { type: "category", data: share.map((s) => s.id), ...axis }, yAxis: valueAxis, series: [{ type: "bar", barWidth: 46, itemStyle: { borderRadius: [8, 8, 0, 0] }, data: share.map((s, i) => ({ value: s.n, itemStyle: { color: palette.series[[1, 0, 2][i]] } })) }] }} />
          <ul className="mt-2 space-y-1.5 text-sm text-muted">{parties.map((p) => <li key={p.id}><b className="text-ink">{p.id}</b> · {p.name}</li>)}</ul>
        </Panel>
      </div>
      <Panel title="All counties" note="Demo figures" className="mt-4">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted">Party</span>
          {[null, ...parties.map((p) => p.id)].map((id) => <Link key={id ?? "all"} href={build(ctx, { params: { ...ctx.params, "filters.party": id ?? "", "page.no": "" } })} className={`rounded-md border px-3 py-1 ${(ctx.params["filters.party"] ?? null) === id ? "border-transparent bg-accent text-paper" : "border-line hover:border-muted"}`}>{id ?? "All"}</Link>)}
          <span className="ml-auto text-xs text-muted">{rows.length} counties · page {pageNo} of {pages}</span>
        </div>
        <div className="overflow-x-auto"><table className="w-full min-w-[520px] text-sm"><thead><tr className="text-left font-mono text-[10px] uppercase tracking-widest text-muted">{cols.map(([k, h]) => <th key={k} className="p-3" aria-sort={sortBy === k ? (dir === "asc" ? "ascending" : "descending") : undefined}>{k === "winner" ? h : <Link href={build(ctx, { params: { ...ctx.params, "sort.by": k, "sort.dir": sortBy === k && dir === "asc" ? "desc" : "asc", "page.no": "" } })} className="hover:text-ink">{h}{sortBy === k ? (dir === "asc" ? " ↑" : " ↓") : ""}</Link>}</th>)}</tr></thead>
          <tbody>{shown.map((c) => <tr key={c.code} className={`border-t border-line ${c.slug === place.county?.slug ? "bg-accent-soft" : ""}`}><td className="p-3"><Link href={build({ ...ctx, trail: [c.slug] }, { params: { ...ctx.params, "page.no": "" } })} className="font-medium text-accent hover:underline">{c.name}</Link></td><td className="p-3">{c.winner}</td><td className="p-3 font-mono">{c.margin} pts</td><td className="p-3 font-mono">{c.turnout}%</td><td className="p-3 font-mono">{compact(c.registered)}</td></tr>)}</tbody></table></div>
        <div className="mt-3 flex items-center justify-between text-sm">
          {pageNo > 1 ? <Link href={build(ctx, { params: { ...ctx.params, "page.no": String(pageNo - 1) } })} className="text-accent">← Previous</Link> : <span />}
          {pageNo < pages ? <Link href={build(ctx, { params: { ...ctx.params, "page.no": String(pageNo + 1) } })} className="text-accent">Next →</Link> : <span />}
        </div>
      </Panel>
    </>
  );
}
