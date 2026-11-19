/** Route `/government/law`: the legal instruments held, highest authority first (the constitution, then acts, then regulations). */
import Link from "next/link";

import { Loaded } from "#/_archives/components/site/loaded";
import {
  Breadcrumbs,
  Gaps,
  PageFrame,
} from "#/_archives/components/site/ui/primitives";
import { date, n } from "#/_archives/lib/site/format";
import { T } from "#/_archives/lib/site/i18n";
import { law, type LawInstrument } from "#/_archives/lib/site/insights";

function byKind(
  list: readonly LawInstrument[],
): { kindCode: string; label: string; items: LawInstrument[] }[] {
  const groups: { kindCode: string; label: string; items: LawInstrument[] }[] =
    [];
  for (const i of list) {
    const last = groups[groups.length - 1];
    if (last && last.kindCode === i.kindCode) last.items.push(i);
    else groups.push({ kindCode: i.kindCode, label: i.kindLabel, items: [i] });
  }
  return groups;
}

export default function LawRoute() {
  return (
    <PageFrame wide>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Law" }]} />
      <p className="kicker">
        <T>{"Legal foundations"}</T>
      </p>
      <h1 className="hero-title text-4xl sm:text-5xl">
        <T>{"Law"}</T>
      </h1>
      <p className="mt-3 mb-7 max-w-3xl text-content-muted">
        <T>
          {
            "The legal instruments held, from the highest authority down. Open one to read its text and follow its links to institutions, leaders and places."
          }
        </T>
      </p>
      <Loaded read={() => law()}>
        {({ instruments, gaps }) => (
          <>
            {byKind(instruments).map((g) => (
              <section key={g.kindCode} className="mb-8">
                <h2 className="mb-3 font-display text-2xl">{g.label}</h2>
                <ul className="grid gap-4 md:grid-cols-2">
                  {g.items.map((i) => (
                    <li key={i.code}>
                      <Link
                        href={`/government/law/${i.code}`}
                        className="glass card card-lift block h-full"
                      >
                        <p className="font-display text-xl">{i.name}</p>
                        <p className="mt-1 text-sm text-content-muted">
                          {i.enactedOn ? `${date(i.enactedOn)} · ` : ""}
                          {n(i.provisions)} provisions
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            <Gaps items={gaps} topic="law" />
          </>
        )}
      </Loaded>
    </PageFrame>
  );
}
