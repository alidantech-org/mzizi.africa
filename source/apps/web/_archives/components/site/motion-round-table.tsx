"use client";

/** The round table of one decision with the party filter; the only interactive part of the motion page. */
import { useState } from "react";

import { Hemicycle } from "#/_archives/components/site/ui/hemicycle";
import { Section } from "#/_archives/components/site/ui/primitives";
import type { MotionMember } from "#/_archives/lib/site/insights";

export function RoundTable({
  members,
  parties,
}: {
  members: readonly MotionMember[];
  parties: readonly string[];
}) {
  const [party, setParty] = useState<string | null>(null);
  return (
    <Section kicker="Round table" title="How each member voted">
      <div className="glass card">
        <Hemicycle members={members} selectedParty={party} />
        <div
          className="mt-4 flex flex-wrap justify-center gap-2"
          role="group"
          aria-label="Highlight a party"
        >
          <button
            className="tab"
            data-active={party === null}
            onClick={() => setParty(null)}
          >
            All parties
          </button>
          {parties.slice(0, 8).map((p) => (
            <button
              key={p}
              className="tab"
              data-active={party === p}
              onClick={() => setParty(party === p ? null : p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </Section>
  );
}
