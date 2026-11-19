/** Route `/government/parliament`: what public bodies decided — bills, motions, budgets, appointments and judgments — with the tally of each. */
import Link from "next/link";
import { T } from "#/_archives/lib/site/i18n";

import { Loaded } from "#/_archives/components/site/loaded";
import { Stacked } from "#/_archives/components/site/ui/charts";
import {
  Breadcrumbs,
  Gaps,
  PageFrame,
  Pill,
} from "#/_archives/components/site/ui/primitives";
import { statusTone } from "#/_archives/components/site/ui/status";
import { date, words } from "#/_archives/lib/site/format";
import { motions } from "#/_archives/lib/site/insights";

export default function ParliamentRoute() {
  return (
    <PageFrame>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Parliament and other bodies" },
        ]}
      />
      <p className="kicker">Decisions</p>
      <h1 className="hero-title text-4xl sm:text-5xl">
        <T>{"Parliament and other bodies"}</T>
      </h1>
      <p className="mt-2 max-w-2xl text-content-muted">
        <T>
          {
            "The National Assembly, a county assembly, the Cabinet and the Supreme Court. Open a decision to see how every member voted — yes, no, abstained or absent."
          }
        </T>
      </p>
      <Loaded read={() => motions()}>
        {({ motions: list }) => (
          <>
            <ul className="mt-8 grid gap-4 md:grid-cols-2">
              {list.map((m) => (
                <li key={m.code}>
                  <Link
                    href={`/government/parliament/motions/${m.code}`}
                    className="glass card card-lift block h-full"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Pill tone={statusTone(m.outcome)}>
                        {words(m.outcome)}
                      </Pill>
                      <Pill>{words(m.kind)}</Pill>
                      <span className="text-xs text-content-muted">
                        {date(m.held_on)}
                      </span>
                    </div>
                    <h2 className="mt-2 font-display text-xl">{m.title}</h2>
                    <p className="text-sm text-content-muted">
                      {m.institution}
                    </p>
                    <div className="mt-3">
                      <Stacked
                        label="Votes"
                        parts={[
                          { label: "Yes", value: m.yes },
                          { label: "No", value: m.no },
                          { label: "Abstained", value: m.abstain },
                          { label: "Absent", value: m.absent },
                        ]}
                      />
                    </div>
                    <p className="num mt-1 text-xs text-content-muted">
                      {m.yes} yes · {m.no} no · {m.abstain} abstained ·{" "}
                      {m.absent} absent
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
            <Gaps
              topic="parliament activity"
              items={[
                "Sittings, motions and divisions here are sample data for the National Assembly, the Nairobi County Assembly, the Cabinet and the Supreme Court. The Senate, other county assemblies and committee work are not recorded yet.",
              ]}
            />
          </>
        )}
      </Loaded>
    </PageFrame>
  );
}
