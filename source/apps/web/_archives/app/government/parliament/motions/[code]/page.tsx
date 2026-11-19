/** Route `/government/parliament/motions/<code>`: one decision with a round-table of every member's vote, the party blocs and the law or budget it concerns. */
import Link from "next/link";
import { leaderAt } from "#/_archives/lib/site/links";

import { Loaded } from "#/_archives/components/site/loaded";
import { RoundTable } from "#/_archives/components/site/motion-round-table";
import { Stacked } from "#/_archives/components/site/ui/charts";
import {
  Breadcrumbs,
  Gaps,
  PageFrame,
  Pill,
  Section,
  Stat,
} from "#/_archives/components/site/ui/primitives";
import { statusTone } from "#/_archives/components/site/ui/status";
import { date, words } from "#/_archives/lib/site/format";
import { motionOf } from "#/_archives/lib/site/insights";

export const dynamic = "force-dynamic";

export default async function MotionRoute({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return (
    <PageFrame>
      <Loaded read={() => motionOf(decodeURIComponent(code))}>
        {(d) => (
          <>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Parliament", href: "/government/parliament" },
                { label: d.motion.title },
              ]}
            />
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone={statusTone(d.motion.outcome)}>
                {words(d.motion.outcome)}
              </Pill>
              <Pill>{words(d.motion.kind)}</Pill>
              <span className="text-sm text-content-muted">
                {date(d.motion.held_on)} · {d.motion.sitting}
              </span>
            </div>
            <h1 className="hero-title mt-3 text-3xl sm:text-5xl">
              {d.motion.title}
            </h1>
            <p className="mt-2 max-w-2xl text-content-muted">
              {d.motion.summary}{" "}
              {d.motion.moved_by ? `Moved by ${d.motion.moved_by}.` : ""}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-4">
              <Stat label="Yes" value={d.tally.yes} tone="good" />
              <Stat label="No" value={d.tally.no} tone="bad" />
              <Stat label="Abstained" value={d.tally.abstain} />
              <Stat
                label="Absent"
                value={d.tally.absent}
                hint={`${d.tally.total} members`}
              />
            </div>
            <RoundTable
              members={d.members}
              parties={d.parties.map((p) => p.party)}
            />
            <Section kicker="Blocs" title="Votes by party">
              <div className="glass card space-y-3">
                {d.parties.map((p) => (
                  <div key={p.party}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-semibold">{p.party}</span>
                      <span className="num text-content-muted">
                        {p.yes} yes · {p.no} no · {p.abstain} abstained ·{" "}
                        {p.absent} absent
                      </span>
                    </div>
                    <Stacked
                      label={`${p.party} votes`}
                      parts={[
                        { label: "Yes", value: p.yes },
                        { label: "No", value: p.no },
                        { label: "Abstained", value: p.abstain },
                        { label: "Absent", value: p.absent },
                      ]}
                    />
                  </div>
                ))}
              </div>
            </Section>
            {d.legal ? (
              <Section kicker="Law and money" title="What it concerns">
                <div className="grid gap-4 md:grid-cols-2">
                  {d.legal.provision ? (
                    <div className="glass card">
                      <p className="kicker">Law</p>
                      <p className="font-display text-xl">
                        {d.legal.provision.designation}
                        {d.legal.provision.title
                          ? ` — ${d.legal.provision.title}`
                          : ""}
                      </p>
                      <p className="text-sm text-content-muted">
                        {d.legal.provision.instrument}
                      </p>
                    </div>
                  ) : null}
                  {d.legal.fiscalYear ? (
                    <div className="glass card">
                      <p className="kicker">Budget</p>
                      <p className="font-display text-xl">
                        Financial year{" "}
                        {d.legal.fiscalYear.starts_on.slice(0, 4)}/
                        {d.legal.fiscalYear.ends_on.slice(0, 4)}
                      </p>
                      <p className="text-sm text-content-muted">
                        {date(d.legal.fiscalYear.starts_on)} –{" "}
                        {date(d.legal.fiscalYear.ends_on)}
                      </p>
                    </div>
                  ) : null}
                </div>
              </Section>
            ) : null}
            {d.motion.contributions && d.motion.contributions.length > 0 ? (
              <Section kicker="In the chamber" title="Who spoke">
                <ul className="grid gap-3 md:grid-cols-2">
                  {d.motion.contributions.map((c, i) => (
                    <li key={i} className="glass card !py-3">
                      <div className="flex items-center justify-between gap-2">
                        <Link
                          className="font-semibold hover:underline"
                          href={leaderAt({
                            holderId: c.holder_id,
                            leaderSlug: c.leaderSlug,
                          })}
                        >
                          {c.name}
                        </Link>
                        <Pill>{words(c.kind)}</Pill>
                      </div>
                      <p className="text-xs text-content-muted">
                        {c.party ?? "No party"}
                        {c.word_count ? ` · ${c.word_count} words` : ""}
                      </p>
                      <p className="mt-1 text-sm">{c.summary}</p>
                    </li>
                  ))}
                </ul>
              </Section>
            ) : null}
            <Section kicker="Members" title="Every vote">
              <div className="glass card max-h-[32rem] overflow-auto">
                <table className="table-clean">
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Party</th>
                      <th>Seat</th>
                      <th>Vote</th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.members.map((m) => (
                      <tr key={m.holderId}>
                        <td>
                          <Link
                            className="underline-offset-2 hover:underline"
                            href={leaderAt(m)}
                          >
                            {m.name}
                          </Link>
                        </td>
                        <td>{m.party ?? "—"}</td>
                        <td className="text-content-muted">
                          {m.unit ?? m.office}
                        </td>
                        <td>
                          <Pill
                            tone={
                              m.position === "yes"
                                ? "good"
                                : m.position === "no"
                                  ? "bad"
                                  : m.position === "abstain"
                                    ? "warn"
                                    : "plain"
                            }
                          >
                            {words(m.position)}
                          </Pill>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
            <Gaps items={d.gaps} topic={d.motion.title} />
          </>
        )}
      </Loaded>
    </PageFrame>
  );
}
