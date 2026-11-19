"use client";
/** Flat SVG map drawn from our own boundary shapes: clickable regions, no zoom, no drag, no tiles. */
import { useMemo, useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "react-aria-components";
import type { Region, RegionStats } from "#/data/fake";

type Metric = "sources" | "claims" | "confidence";
const metrics: { id: Metric; label: string }[] = [
  { id: "sources", label: "Sources" },
  { id: "claims", label: "Claims" },
  { id: "confidence", label: "Confidence" },
];
const steps = ["var(--scale-0)", "var(--scale-1)", "var(--scale-2)", "var(--scale-3)", "var(--scale-4)"];

export function RegionMap({ map, stats }: { map: { width: number; height: number; country: string; regions: Region[] }; stats: RegionStats[] }) {
  const [metric, setMetric] = useState<Metric>("sources");
  const [selected, setSelected] = useState<string>(stats[0].code);
  const [hover, setHover] = useState<string | null>(null);
  const byCode = useMemo(() => new Map(stats.map((s) => [s.code, s])), [stats]);
  const values = stats.map((s) => s[metric]);
  const [lo, hi] = [Math.min(...values), Math.max(...values)];
  const fill = (code: string) => steps[Math.min(4, Math.floor(((byCode.get(code)![metric] - lo) / (hi - lo || 1)) * 5))];
  const current = byCode.get(hover ?? selected)!;
  const share = Math.round((current.reviewed / current.claims) * 100);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div>
        <ToggleButtonGroup
          aria-label="Map metric"
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[metric]}
          onSelectionChange={(k) => setMetric([...k][0] as Metric)}
          className="mb-4 inline-flex rounded-full border border-line bg-paper p-1"
        >
          {metrics.map((m) => (
            <ToggleButton key={m.id} id={m.id} className="cursor-pointer rounded-md px-4 py-1.5 text-sm outline-none transition data-[selected]:bg-ink data-[selected]:text-paper data-[focus-visible]:ring-2 data-[focus-visible]:ring-accent">
              {m.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <svg viewBox={`0 0 ${map.width} ${map.height}`} role="group" aria-label="Kenya counties" className="mx-auto max-h-[560px] w-full">
          <path d={map.country} fill="none" stroke="var(--ink)" strokeOpacity={0.25} strokeWidth={6} strokeLinejoin="round" />
          {map.regions.map((r) => (
            <path
              key={r.code}
              d={r.d}
              className="region"
              role="button"
              tabIndex={0}
              aria-label={`${r.name}, ${byCode.get(r.code)![metric]} ${metric}`}
              aria-pressed={selected === r.code}
              fill={fill(r.code)}
              stroke={selected === r.code ? "var(--ink)" : "var(--paper)"}
              strokeWidth={selected === r.code ? 2.6 : 1.1}
              strokeLinejoin="round"
              onClick={() => setSelected(r.code)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelected(r.code)}
              onMouseEnter={() => setHover(r.code)}
              onMouseLeave={() => setHover(null)}
            />
          ))}
        </svg>
        <div className="mt-2 flex items-center justify-center gap-1 font-mono text-[11px] text-muted">
          <span>low</span>
          {steps.map((s) => <span key={s} className="h-2.5 w-9 first:rounded-l-full last:rounded-r-full" style={{ background: s }} />)}
          <span>high</span>
        </div>
      </div>
      <aside className="rounded-lg bg-ink p-6 text-paper">
        <div className="font-mono text-[11px] uppercase tracking-widest opacity-60">{hover ? "Hovering" : "Selected county"}</div>
        <h3 className="mt-2 font-display text-4xl tracking-tight">{current.name}</h3>
        <dl className="mt-6 space-y-4">
          {[["Sources", current.sources], ["Claims", current.claims], ["Reviewed", `${share}%`], ["Confidence", `${current.confidence}/100`]].map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between border-b border-paper/15 pb-2">
              <dt className="text-sm opacity-70">{k}</dt>
              <dd className="font-mono text-lg">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-xs leading-relaxed opacity-60">Demo figures. Shapes are drawn from boundary data by our own build script.</p>
      </aside>
    </div>
  );
}
