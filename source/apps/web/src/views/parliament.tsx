import { placeName, type ViewProps } from "./types";
/** Parliament: the National Assembly's 350 seats. Seat places are real; the vote is a demo. */
import { Hemicycle, type Seat } from "#/components/hemicycle";
import { Kpi, Panel } from "#/components/panel";
import { DemoTag, PageHeader, RealTag } from "#/components/ui";
import { parties } from "#/data/demo";
import { counties } from "#/data/places";
import { Check, Minus, X, UserX } from "lucide-react";

const rand = (seed: number) => () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);

export function Parliament({ ctx, place }: ViewProps) {
  const r = rand(350);
  const places: Omit<Seat, "vote" | "party" | "id">[] = [
    ...counties.flatMap((c) => c.constituencies.map((k) => ({ place: k.name, kind: "Constituency member" }))),
    ...counties.map((c) => ({ place: `${c.name} (Woman Representative)`, kind: "County seat" })),
    ...Array.from({ length: 12 }, (_, i) => ({ place: `Special interest seat ${i + 1}`, kind: "Nominated" })),
    { place: "Speaker", kind: "Ex officio" },
  ];
  const seats: Seat[] = places.map((p, id) => {
    const v = r();
    return { ...p, id, party: parties[v < 0.5 ? 0 : v < 0.88 ? 1 : 2].id, vote: v < 0.52 ? "yes" : v < 0.88 ? "no" : v < 0.93 ? "abstain" : "absent" };
  });
  const tally = { yes: 0, no: 0, abstain: 0, absent: 0 };
  seats.forEach((s) => tally[s.vote]++);
  const bloc = parties.map((p) => ({ p, ...Object.fromEntries((["yes", "no", "abstain", "absent"] as const).map((v) => [v, seats.filter((s) => s.party === p.id && s.vote === v).length])) as typeof tally }));
  return (
    <>
      <PageHeader eyebrow={`Parliament · ${placeName(place)}`} title="One decision, every seat" actions={<div className="flex gap-2"><RealTag>350 seats</RealTag><DemoTag>Vote is a demo</DemoTag></div>}>Each dot is a seat of the National Assembly: 290 constituencies, 47 county seats, 12 nominated seats and the Speaker. Seat places are real; the vote and parties are placeholders.</PageHeader>
      <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Yes" value={String(tally.yes)} delta="in favour" tone="c2" icon={Check} />
        <Kpi label="No" value={String(tally.no)} delta="against" tone="c1" icon={X} />
        <Kpi label="Abstained" value={String(tally.abstain)} delta="no position" tone="c3" icon={Minus} />
        <Kpi label="Absent" value={String(tally.absent)} delta="did not vote" tone="c4" icon={UserX} />
      </div>
      <Hemicycle seats={seats} tally={tally} selected={ctx.params["view.seat"] ? Number(ctx.params["view.seat"]) : place.constituency ? seats.find((x) => x.place === place.constituency!.name)?.id : undefined} />
      <Panel title="Party blocs" className="mt-4"><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left font-mono text-[10px] uppercase tracking-widest text-muted">{["Party", "Yes", "No", "Abstained", "Absent"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
        <tbody>{bloc.map((b) => <tr key={b.p.id} className="border-t border-line"><td className="p-3"><span className="rounded-md px-3 py-1 text-xs font-medium" style={{ background: `color-mix(in srgb, var(--${b.p.color}) 18%, transparent)` }}>{b.p.id} · {b.p.name}</span></td><td className="p-3">{b.yes}</td><td className="p-3">{b.no}</td><td className="p-3">{b.abstain}</td><td className="p-3">{b.absent}</td></tr>)}</tbody></table></div></Panel>
    </>
  );
}
