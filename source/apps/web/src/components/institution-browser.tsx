"use client";
/** Real institutions from the seed, grouped by kind, with their offices and parent bodies. */
import { ArrowUp, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useNav } from "#/lib/use-ctx";
import { PagedList } from "./paged-list";
import { TextField } from "./controls";
import data from "#/data/generated/governance.json";

type Inst = { code: string; name: string; kind: string };
const kindLabel: Record<string, string> = { "constitutional-commission": "Constitutional commissions", "independent-office": "Independent offices", "executive-organ": "Executive", "legislative-chamber": "Parliament", court: "Courts", "security-organ": "Security services" };
const kindBlurb: Record<string, string> = {
  "constitutional-commission": "A body created by the Constitution to act independently of the arms of government.",
  "independent-office": "An office the Constitution sets up and protects from direction by any person or authority.",
  "executive-organ": "Part of the national executive led by the President.",
  "legislative-chamber": "Makes laws and oversees the executive.",
  court: "Hears cases and decides disputes under the Constitution.",
  "security-organ": "A security service set up under Chapter 14.",
};

export function InstitutionBrowser({ selected, kind: kindParam }: { selected?: string; kind?: string }) {
  const nav = useNav();
  const [q, setQ] = useState("");
  const kind = kindParam ?? "all";
  const setKind = (k: string) => nav.set({ "filters.kind": k === "all" ? null : k, "view.id": null, "view.entity": null });
  const code = selected ?? data.institutions[0].code;
  const setCode = (c: string) => nav.set({ "view.entity": "institution", "view.id": c }, false);
  const list = data.institutions as Inst[];
  const shown = useMemo(() => list.filter((i) => (kind === "all" || i.kind === kind) && i.name.toLowerCase().includes(q.toLowerCase())), [list, q, kind]);
  const ordered = useMemo(() => [...new Set(list.map((i) => i.kind))].flatMap((k) => shown.filter((i) => i.kind === k)), [list, shown]);
  const sel = list.find((i) => i.code === code) ?? list[0];
  const name = (c: string) => list.find((i) => i.code === c)?.name ?? c;
  const offices = data.offices.filter((o) => o.institution === sel.code);
  const parents = data.links.filter((l) => l.from === sel.code);
  const children = data.links.filter((l) => l.to === sel.code);
  const kinds = [...new Set(list.map((i) => i.kind))];
  const chip = (a: boolean) => `rounded-md border px-3.5 py-1.5 text-sm transition ${a ? "border-transparent bg-accent text-paper" : "border-line bg-surface hover:border-muted"}`;
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <TextField label="Search institutions" value={q} onChange={setQ} placeholder="Search a public body" icon={<Search size={15} />} className="min-w-60 flex-1" />
        <button className={chip(kind === "all")} onClick={() => setKind("all")}>All</button>
        {kinds.map((k) => <button key={k} className={chip(kind === k)} onClick={() => setKind(k)}>{kindLabel[k] ?? k}</button>)}
      </div>
      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        <nav aria-label="Institutions" className="lg:self-start">
          <PagedList unit="institutions" items={ordered} pageSize={10} selected={ordered.findIndex((i) => i.code === sel.code)} resetKey={`${q}|${kind}`} empty={<p className="p-4 text-sm text-muted">Nothing matches.</p>}
            render={(i, prev) => (
              <div key={i.code}>
                {prev?.kind !== i.kind && <div className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-widest text-muted">{kindLabel[i.kind] ?? i.kind}</div>}
                <button onClick={() => setCode(i.code)} className={`block w-full rounded-md px-3 py-2 text-left text-sm transition ${i.code === sel.code ? "bg-accent text-paper" : "hover:bg-accent-soft"}`}>{i.name}</button>
              </div>
            )} />
        </nav>
        <article className="rounded-lg border border-line bg-surface p-7">
          <span className="rounded-full bg-c2/15 px-3 py-1 text-xs text-c2">{kindLabel[sel.kind] ?? sel.kind}</span>
          <h2 className="mt-4 font-display text-4xl leading-tight tracking-tight">{sel.name}</h2>
          <p className="mt-3 max-w-xl text-muted">{kindBlurb[sel.kind]}</p>
          <h3 className="mb-3 mt-8 font-display text-xl">Who leads it</h3>
          {offices.length ? <div className="grid gap-3 sm:grid-cols-2">{offices.map((o) => <div key={o.code} className="rounded-lg border border-line bg-paper p-4"><div className="font-mono text-[10px] uppercase tracking-widest text-muted">Office</div><div className="mt-1 font-medium capitalize">{o.kind.replace(/-/g, " ")}</div><div className="mt-1 break-all font-mono text-[11px] text-muted">{o.code}</div></div>)}</div> : <p className="text-sm text-muted">No offices are recorded yet for this body.</p>}
          <h3 className="mb-3 mt-8 font-display text-xl">Its place in the hierarchy</h3>
          <ol className="space-y-2">
            {parents.map((l) => <li key={l.to} className="flex items-center gap-3 rounded-lg border border-line px-4 py-3 text-sm"><ArrowUp size={14} className="text-accent" /><span className="text-muted">Part of</span><button onClick={() => setCode(l.to)} className="font-medium hover:text-accent">{name(l.to)}</button></li>)}
            <li className="rounded-lg border border-accent bg-accent-soft px-4 py-3 text-sm font-medium">{sel.name}</li>
            {children.map((l) => <li key={l.from} className="flex items-center gap-3 rounded-lg border border-line px-4 py-3 text-sm"><span className="text-muted">Includes</span><button onClick={() => setCode(l.from)} className="font-medium hover:text-accent">{name(l.from)}</button></li>)}
          </ol>
          <p className="mt-6 text-xs text-muted">Offices and relationships come from the Constitution drafts in the seed. Names of holders are not loaded yet.</p>
        </article>
      </div>
    </div>
  );
}
