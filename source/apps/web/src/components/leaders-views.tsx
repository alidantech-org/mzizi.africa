"use client";
/** Tree, family tree, radial and matrix views of the offices of government. */
import { ChevronRight, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-aria-components";
import { branches, flat, tree, type Branch, type Level, type Office } from "#/data/government";
import { RoleBadge, RoleLegend, roles, type Role } from "./ui";
import { useNav } from "#/lib/use-ctx";
import { Cite } from "./cite";

const levelTag = (l?: Level) => l && <span className="rounded-md border border-line px-1.5 py-0.5 text-[10px] text-muted">{l}</span>;

function Row({ o, depth, open, toggle, pick, selected, filter }: { o: Office; depth: number; open: Set<string>; toggle: (id: string) => void; pick: (o: Office) => void; selected?: string; filter: Role | "all" }) {
  const kids = (o.children ?? []).filter((c) => filter === "all" || c.role === filter || c.children);
  const isOpen = open.has(o.id);
  if (filter !== "all" && !o.children && o.role !== filter) return null;
  return (
    <div>
      <div className={`flex items-center gap-3 rounded-lg border bg-surface px-3 py-2.5 transition ${selected === o.id ? "border-accent bg-accent-soft" : "border-line hover:border-muted"}`} style={{ marginLeft: depth * 18 }}>
        <button aria-label={isOpen ? "Collapse" : "Expand"} onClick={() => (kids.length ? toggle(o.id) : pick(o))} className={`grid size-6 shrink-0 place-items-center rounded-md border border-line ${kids.length ? "" : "opacity-0"}`}>{isOpen ? <Minus size={12} /> : <Plus size={12} />}</button>
        <button onClick={() => pick(o)} className="min-w-0 flex-1 text-left">
          <div className="truncate text-sm font-medium">{o.name}</div>
          <div className="truncate text-xs text-muted">{o.note}</div>
        </button>
        {levelTag(o.level)}
        {o.seats != null && <span className="font-display text-xl">{o.seats}</span>}
        {o.role && <RoleBadge role={o.role} />}
      </div>
      {isOpen && kids.length > 0 && <div className="mt-2 space-y-2">{kids.map((c) => <Row key={c.id} o={c} depth={depth + 1} open={open} toggle={toggle} pick={pick} selected={selected} filter={filter} />)}</div>}
    </div>
  );
}

function TreeView({ officeId }: { officeId?: string }) {
  const nav = useNav();
  const [open, setOpen] = useState(new Set<string>(["national-assembly", "county-assembly"]));
  const [branch, setBranch] = useState<Branch | "all">("all");
  const [role, setRole] = useState<Role | "all">("all");
  const all0 = Object.values(tree).flatMap((l) => flat(l));
  const sel = all0.find((o) => o.id === officeId) ?? tree.county[0];
  const setSel = (o: Office) => nav.set({ "view.office": o.id });
  const toggle = (id: string) => setOpen((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const all = new Set(Object.values(tree).flatMap((l) => flat(l).filter((o) => o.children).map((o) => o.id)));
  const chip = (active: boolean) => `rounded-md border px-3.5 py-1.5 text-sm transition ${active ? "border-transparent bg-accent text-paper" : "border-line bg-surface hover:border-muted"}`;
  return (
    <div>
      <div className="mb-5 space-y-3 rounded-lg border border-line bg-surface p-5">
        <div className="flex flex-wrap items-center gap-2"><span className="w-20 font-mono text-[10px] uppercase tracking-widest text-muted">Branch</span>
          <button className={chip(branch === "all")} onClick={() => setBranch("all")}>All</button>
          {branches.map((b) => <button key={b.id} className={chip(branch === b.id)} onClick={() => setBranch(b.id)}>{b.label}</button>)}</div>
        <div className="flex flex-wrap items-center gap-2"><span className="w-20 font-mono text-[10px] uppercase tracking-widest text-muted">How</span>
          <button className={chip(role === "all")} onClick={() => setRole("all")}>All</button>
          {(Object.keys(roles) as Role[]).map((r) => <button key={r} className={chip(role === r)} onClick={() => setRole(r)}>{roles[r].mark} {roles[r].label}</button>)}</div>
        <RoleLegend />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-lg border border-line bg-surface p-5">
          <div className="mb-4 flex items-center justify-between"><h3 className="font-display text-xl">The Republic of Kenya</h3>
            <div className="flex gap-2"><button className={chip(false)} onClick={() => setOpen(all)}>Expand all</button><button className={chip(false)} onClick={() => setOpen(new Set())}>Collapse all</button></div></div>
          <div className="mb-3 rounded-lg bg-surface border border-line px-4 py-3 text-side-ink"><div className="text-sm font-medium">Sovereignty belongs to the people</div><div className="text-xs opacity-70">Constitution of Kenya, Article 1</div></div>
          <div className="space-y-4">
            {branches.filter((b) => branch === "all" || b.id === branch).map((b) => (
              <div key={b.id}>
                <div className="mb-2 flex items-center gap-2 px-1"><span className="font-display text-lg">{b.label}</span><span className="text-xs text-muted">{b.blurb}</span></div>
                <div className="space-y-2">{tree[b.id].map((o) => <Row key={o.id} o={o} depth={0} open={open} toggle={toggle} pick={setSel} selected={sel.id} filter={role} />)}</div>
              </div>
            ))}
          </div>
        </div>
        <aside className="h-fit rounded-lg border border-line bg-surface p-6 lg:sticky lg:top-24">
          <div className="font-mono text-[10px] uppercase tracking-widest text-accent">Selected office</div>
          <h3 className="mt-2 font-display text-3xl tracking-tight">{sel.name}</h3>
          <p className="mt-1 text-sm text-muted">{sel.note}</p>
          <div className="mt-3 flex gap-2">{sel.role && <RoleBadge role={sel.role} />}{levelTag(sel.level)}</div>
          <dl className="mt-5 divide-y divide-line text-sm">
            {([["Seats", sel.seats], ["Term", sel.term], ["How the seat is filled", sel.filled], ["Answers to", sel.answersTo], ["Can be removed by", sel.removal]] as const).filter(([, v]) => v != null).map(([k, v]) => <div key={k} className="grid grid-cols-[110px_1fr] gap-3 py-2.5"><dt className="text-muted">{k}</dt><dd className="text-right font-medium">{v}</dd></div>)}
          </dl>
          {sel.article && <div className="mt-5 flex items-center gap-1 text-sm font-medium">Constitution: <Cite article={sel.article}>{sel.article}</Cite><ChevronRight size={14} className="text-muted" /></div>}
        </aside>
      </div>
    </div>
  );
}

function FamilyTree() {
  const tone: Record<Role | "body", string> = { elected: "border-c2 bg-c2/10", nominated: "border-c4 bg-c4/10", appointed: "border-c3 bg-c3/15", exofficio: "border-muted bg-line/50", body: "border-muted bg-surface" };
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-surface p-6">
      <div className="mx-auto min-w-[960px]">
        <div className="mx-auto w-fit rounded-md bg-surface border border-line px-8 py-3 text-center text-side-ink"><div className="font-medium">The People of Kenya</div><div className="text-xs opacity-70">Article 1: all sovereign power</div></div>
        <div className="mx-auto h-6 w-px bg-muted/50" />
        <div className="grid grid-cols-5 gap-4 border-t border-muted/50 pt-0">
          {branches.map((b) => (
            <div key={b.id} className="relative">
              <div className="mx-auto h-6 w-px bg-muted/50" />
              <div className="rounded-md bg-surface border border-line px-3 py-3 text-center text-side-ink"><div className="font-medium">{b.label}</div><div className="text-xs opacity-70">{b.blurb}</div></div>
              <div className="mt-4 grid gap-2">
                {flat(tree[b.id]).filter((o) => o.role || o.seats).slice(0, 9).map((o) => (
                  <div key={o.id} className={`rounded-md border px-3 py-2 text-center text-xs ${tone[o.role ?? "body"]}`}>
                    <div className="font-medium leading-tight">{o.name}</div>
                    <div className="mt-1 text-[11px] text-muted">{o.role ? `${roles[o.role].mark} ${roles[o.role].label}` : "Body"}{o.seats != null ? ` · ${o.seats}` : ""}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-6 text-xs text-muted">Boxes in a column answer to that branch. Border colour shows how the seat is filled.</p>
    </div>
  );
}

function Matrix() {
  const levels: Level[] = ["National", "County", "Ward"];
  const cols: Role[] = ["elected", "nominated", "appointed", "exofficio"];
  const leaves = Object.values(tree).flatMap((l) => flat(l)).filter((o) => o.role && o.level);
  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[820px] grid-cols-[90px_repeat(4,1fr)] gap-3">
        <div />
        {cols.map((c) => <div key={c}><RoleBadge role={c} /></div>)}
        {levels.map((lv) => (
          <div key={lv} className="contents">
            <div className="pt-4 font-display text-2xl">{lv}</div>
            {cols.map((c) => {
              const list = leaves.filter((o) => o.level === lv && o.role === c);
              return (
                <div key={c} className="min-h-[150px] rounded-lg border border-line bg-surface p-4">
                  {list.length ? <ul className="space-y-1.5 text-sm">{list.map((o) => <li key={o.id}>{o.name}{o.seats != null && <span className="text-muted"> · {o.seats}</span>}</li>)}</ul> : <span className="text-sm text-muted">None at this level</span>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-5"><RoleLegend /></div>
    </div>
  );
}

export function LeadersViews({ radial, mode, office }: { radial: ReactNode; mode?: string; office?: string }) {
  const nav = useNav();
  const modes = ["tree", "family", "radial", "matrix"];
  const tab = "cursor-pointer rounded-md border border-line bg-surface px-4 py-2 text-sm outline-none transition data-[selected]:border-transparent data-[selected]:bg-accent data-[selected]:text-paper data-[focus-visible]:ring-2 data-[focus-visible]:ring-accent";
  return (
    <Tabs selectedKey={modes.includes(mode ?? "") ? mode : "tree"} onSelectionChange={(k) => nav.set({ "view.mode": String(k) === "tree" ? null : String(k), "view.office": null })}>
      <TabList aria-label="View" className="mb-6 flex flex-wrap gap-2">
        {[["tree", "Tree"], ["family", "Family tree"], ["radial", "Radial"], ["matrix", "Matrix"]].map(([id, t]) => <Tab key={id} id={id} className={tab}>{t}</Tab>)}
      </TabList>
      <TabPanel id="tree"><TreeView officeId={office} /></TabPanel>
      <TabPanel id="family"><FamilyTree /></TabPanel>
      <TabPanel id="radial">
        <div className="rounded-lg border border-line bg-surface p-6">{radial}<p className="mt-2 text-xs text-muted">Start at the people in the middle. Each ring out is one step down. Arc size shows how many offices a branch holds, not seats or power.</p></div>
      </TabPanel>
      <TabPanel id="matrix"><Matrix /></TabPanel>
    </Tabs>
  );
}
