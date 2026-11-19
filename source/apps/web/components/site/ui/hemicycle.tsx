"use client";

/**
 * The "round table": every member of a body as a dot on concentric arcs facing the speaker. Colour says how they voted
 * (yes, no, abstained, absent); members are ordered by party so blocs sit together. Hover or focus a dot for the member.
 */
import Link from "next/link";
import { useState } from "react";

import type { MotionMember } from "#/lib/site/insights.ts";

const COLOUR: Record<string, string> = {
  yes: "oklch(0.545 0.095 130)", no: "oklch(0.53 0.185 28)", abstain: "oklch(0.735 0.138 76)", absent: "oklch(0.75 0.01 60)",
};
const LABEL: Record<string, string> = { yes: "Voted yes", no: "Voted no", abstain: "Abstained", absent: "Absent" };

function layout(count: number): { x: number; y: number }[] {
  const rows = Math.max(2, Math.round(Math.sqrt(count / 3.2)));
  const radii = Array.from({ length: rows }, (_, i) => 95 + (i * 165) / Math.max(1, rows - 1));
  const total = radii.reduce((a, r) => a + r, 0);
  const seats: { angle: number; r: number }[] = [];
  radii.forEach((r, i) => {
    const n = i === rows - 1 ? count - seats.length : Math.round((count * r) / total);
    for (let k = 0; k < n; k++) seats.push({ angle: Math.PI * (n === 1 ? 0.5 : k / (n - 1)), r });
  });
  seats.sort((a, b) => b.angle - a.angle || a.r - b.r);
  return seats.map((s) => ({ x: 280 - Math.cos(s.angle) * s.r, y: 270 - Math.sin(s.angle) * s.r }));
}

export function Hemicycle({ members, selectedParty }: { members: readonly MotionMember[]; selectedParty?: string | null }) {
  const [active, setActive] = useState<MotionMember | null>(null);
  const ordered = [...members].sort((a, b) => (a.party ?? "~").localeCompare(b.party ?? "~") || a.name.localeCompare(b.name));
  const seats = layout(ordered.length);
  const size = ordered.length > 200 ? 4.2 : ordered.length > 60 ? 6 : 9;
  return (
    <div>
      <svg role="img" aria-label={`Seating chart of ${ordered.length} members and how each voted`} viewBox="0 0 560 306" className="w-full">
        {ordered.map((m, i) => {
          const seat = seats[i]!;
          const dim = selectedParty && m.party !== selectedParty;
          return (
            <circle key={m.holderId} className="dot" cx={seat.x} cy={seat.y} r={size} fill={COLOUR[m.position]} opacity={dim ? 0.18 : 1} tabIndex={0}
              onMouseEnter={() => setActive(m)} onFocus={() => setActive(m)}>
              <title>{`${m.name} (${m.party ?? "no party"}): ${LABEL[m.position]}`}</title>
            </circle>
          );
        })}
        <text x="280" y="299" textAnchor="middle" fontSize="13" fill="var(--content-muted)">{active ? `${active.name} · ${active.party ?? "no party"} · ${LABEL[active.position]}` : "Hover a dot"}</text>
      </svg>
      <ul className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs">
        {Object.entries(LABEL).map(([key, label]) => (
          <li key={key} className="flex items-center gap-1.5"><i className="inline-block h-3 w-3 rounded-full" style={{ background: COLOUR[key] }} />{label}</li>
        ))}
      </ul>
      <p className="mt-2 min-h-6 text-center text-sm">{active ? <Link className="underline" href={`/leaders/${active.holderId}`}>Open {active.name}</Link> : null}</p>
    </div>
  );
}
