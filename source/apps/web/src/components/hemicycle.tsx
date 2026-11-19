"use client";
/** Round-table chart: every seat as a dot, grouped by vote. Select a dot to see that seat. */
import { useMemo } from "react";
import { useNav } from "#/lib/use-ctx";

export type Seat = { id: number; place: string; kind: string; party: string; vote: "yes" | "no" | "abstain" | "absent" };

const color = { yes: "var(--c2)", no: "var(--c1)", abstain: "var(--c3)", absent: "var(--line)" } as const;

export function Hemicycle({ seats, tally, selected }: { seats: Seat[]; tally: Record<Seat["vote"], number>; selected?: number }) {
  const nav = useNav();
  const n = seats.length;
  const placed = useMemo(() => {
    const rows = 9, r0 = 120, r1 = 300;
    const radii = Array.from({ length: rows }, (_, i) => r0 + ((r1 - r0) * i) / (rows - 1));
    const total = radii.reduce((a, b) => a + b, 0);
    const dots: { x: number; y: number; a: number }[] = [];
    radii.forEach((r, i) => {
      const count = i === rows - 1 ? n - dots.length : Math.round((r / total) * n);
      for (let k = 0; k < count; k++) { const a = Math.PI - (Math.PI * (k + 0.5)) / count; dots.push({ x: 320 + r * Math.cos(a), y: 320 - r * Math.sin(a), a }); }
    });
    return dots.sort((p, q) => q.a - p.a);
  }, [n]);
  const order = (["yes", "abstain", "no", "absent"] as const).flatMap((v) => seats.filter((s) => s.vote === v));
  const sel = seats.find((x) => x.id === selected) ?? order[0];
  const setSel = (x: Seat) => nav.set({ "view.seat": String(x.id) });
  return (
    <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
      <div className="rounded-lg border border-line bg-surface p-6">
        <h2 className="font-display text-xl">The round table</h2>
        <svg viewBox="0 0 640 360" className="mx-auto mt-2 w-full max-w-2xl" role="group" aria-label="Seats in the National Assembly">
          {placed.map((p, i) => { const s = order[i]; return s && <circle key={s.id} cx={p.x} cy={p.y} r={sel.id === s.id ? 8 : 5.6} fill={color[s.vote]} stroke={sel.id === s.id ? "var(--ink)" : "none"} strokeWidth="2.5" className="cursor-pointer transition-all" role="button" tabIndex={0} aria-label={`${s.place}, ${s.vote}`} onClick={() => setSel(s)} onKeyDown={(e) => e.key === "Enter" && setSel(s)} />; })}
          <text x="320" y="300" textAnchor="middle" fontSize="44" fill="var(--ink)" style={{ fontFamily: "var(--font-fraunces)" }}>{tally.yes} to {tally.no}</text>
          <text x="320" y="326" textAnchor="middle" fontSize="13" fill="var(--muted)">{tally.yes > tally.no ? "Bill passed" : "Bill not passed"}</text>
        </svg>
      </div>
      <aside className="h-fit rounded-lg border border-line bg-surface p-6">
        <div className="font-mono text-[10px] uppercase tracking-widest text-accent">Selected seat</div>
        <h3 className="mt-2 font-display text-3xl">{sel.place}</h3>
        <dl className="mt-5 divide-y divide-line text-sm">
          {[["Seat type", sel.kind], ["Party", sel.party], ["Vote", sel.vote[0].toUpperCase() + sel.vote.slice(1)], ["Member", "Name not loaded"]].map(([k, v]) => <div key={k} className="flex justify-between py-2.5"><dt className="text-muted">{k}</dt><dd className="font-medium">{v}</dd></div>)}
        </dl>
      </aside>
    </div>
  );
}
