/** Route `/leaders/<holder>`: a leader — who they are, how to reach them, how they got the seat, how they vote and the fund they oversee. */
import Link from "next/link";

import { ViewBeacon } from "#/_archives/components/site/reaction";
import { ReactionButton } from "#/_archives/components/site/engagement";
import { placeAt } from "#/_archives/lib/site/links";
import {
  LegalBasisSection,
  SubjectContentSection,
} from "#/_archives/components/site/governance/server-sections";
import { Loaded } from "#/_archives/components/site/loaded";
import { BarList, Donut } from "#/_archives/components/site/ui/charts";
import { Avatar, Gallery } from "#/_archives/components/site/ui/media";
import {
  Breadcrumbs,
  Gaps,
  PageFrame,
  Pill,
  Section,
  Stat,
} from "#/_archives/components/site/ui/primitives";
import { date, n, pct, words } from "#/_archives/lib/site/format";
import { Money } from "#/_archives/lib/site/country";
import { leaderOf } from "#/_archives/lib/site/insights";
import { LikeLeader } from "#/_archives/components/site/save-buttons";

const CONTACT_ICON: Record<string, string> = {
  email: "✉️",
  telephone: "☎️",
  mobile: "📱",
  website: "🌐",
  x: "𝕏",
  facebook: "f",
  instagram: "◎",
  tiktok: "♪",
  youtube: "▶",
  "physical-address": "📍",
  "postal-address": "📮",
  "social-media": "🔗",
};
const hrefFor = (kind: string, value: string): string | null =>
  kind === "email"
    ? `mailto:${value}`
    : kind === "mobile" || kind === "telephone"
      ? `tel:${value.replace(/\s+/g, "")}`
      : /^https?:/.test(value)
        ? value
        : null;

export default async function LeaderRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PageFrame>
      <Loaded read={() => leaderOf(id)}>
        {(d) => {
          const l = d.leader;
          const portrait =
            d.media.find((m) => m.kind === "portrait") ?? d.media[0];
          const v = d.activity.votes;
          return (
            <>
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  ...(l.unitId
                    ? [
                        {
                          label: l.unit ?? "Place",
                          href: placeAt(l.unitPath, ""),
                          hint: "The area this leader serves",
                        },
                      ]
                    : []),
                  { label: l.name },
                ]}
              />
              <div className="glass card flex flex-wrap items-center gap-6">
                <Avatar src={portrait?.url} name={l.name} size={112} />
                <div className="min-w-0 flex-1">
                  <p className="kicker">
                    {l.office}
                    {l.unit ? ` · ${l.unit}` : ""}
                  </p>
                  <h1 className="hero-title text-3xl sm:text-5xl">{l.name}</h1>
                  <p className="mt-1 text-content-muted">
                    {l.party ?? "No party recorded"}
                    {l.institution ? ` · ${l.institution}` : ""}
                    {l.tookOfficeOn
                      ? ` · in office since ${date(l.tookOfficeOn)}`
                      : ""}
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-4">
                <Stat
                  label="Attendance at votes"
                  value={pct(v.attendance, 0)}
                  hint={`${v.total} divisions`}
                  tone={
                    v.attendance !== null && v.attendance > 0.8
                      ? "good"
                      : undefined
                  }
                />
                <Stat label="Voted yes" value={v.yes} />
                <Stat label="Voted no" value={v.no} />
                <Stat
                  label="Speeches and questions"
                  value={d.activity.contributions.count}
                  hint={`${n(d.activity.contributions.words)} words`}
                />
              </div>
              <Section kicker="Get in touch" title="Contact">
                {d.contacts.length === 0 ? (
                  <p className="text-sm text-content-muted">
                    No public contact details are recorded.
                  </p>
                ) : (
                  <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {d.contacts.map((c) => {
                      const href = hrefFor(c.kind, c.value);
                      return (
                        <li key={`${c.kind}-${c.value}`}>
                          {href ? (
                            <a
                              href={href}
                              target={
                                href.startsWith("http") ? "_blank" : undefined
                              }
                              rel="noreferrer"
                              className="glass card card-lift flex items-center gap-3 !py-3"
                            >
                              <span
                                aria-hidden
                                className="grid h-9 w-9 place-items-center rounded-full bg-surface-sunken"
                              >
                                {CONTACT_ICON[c.kind] ?? "•"}
                              </span>
                              <span className="min-w-0">
                                <span className="block text-xs uppercase tracking-wide text-content-muted">
                                  {words(c.kind)}
                                  {c.scope === "office" ? " · office" : ""}
                                </span>
                                <span className="block truncate font-semibold">
                                  {c.value}
                                </span>
                              </span>
                            </a>
                          ) : (
                            <div className="glass card flex items-center gap-3 !py-3">
                              <span
                                aria-hidden
                                className="grid h-9 w-9 place-items-center rounded-full bg-surface-sunken"
                              >
                                {CONTACT_ICON[c.kind] ?? "•"}
                              </span>
                              <span>
                                <span className="block text-xs uppercase tracking-wide text-content-muted">
                                  {words(c.kind)}
                                </span>
                                <span className="block font-semibold">
                                  {c.value}
                                </span>
                              </span>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Section>
              {d.election.length > 0 ? (
                <Section kicker="How they got the seat" title="Elections won">
                  <div className="grid gap-4 md:grid-cols-2">
                    {d.election.map((e) => (
                      <div key={e.year} className="glass card">
                        <p className="kicker">
                          {e.year} · {date(e.heldOn)}
                        </p>
                        <p className="num font-display text-3xl">
                          {n(e.votes)} votes
                        </p>
                        <p className="text-sm text-content-muted">
                          {pct(e.share)} of {n(e.total)} · lead of{" "}
                          {pct(e.margin)} over the runner-up · {e.candidates}{" "}
                          candidates · {n(e.registered)} registered
                        </p>
                      </div>
                    ))}
                  </div>
                </Section>
              ) : null}
              <Section kicker="Record" title="How they vote">
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="glass card">
                    <Donut
                      label="Votes cast"
                      slices={[
                        { label: "Yes", value: v.yes },
                        { label: "No", value: v.no },
                        { label: "Abstained", value: v.abstain },
                        { label: "Absent", value: v.absent },
                      ]}
                      center={`${v.total}`}
                    />
                  </div>
                  <div className="glass card">
                    <h3 className="mb-2 font-semibold">Recent decisions</h3>
                    <ul className="space-y-2 text-sm">
                      {d.activity.recent.map((r) => (
                        <li
                          key={r.code}
                          className="flex items-center justify-between gap-3"
                        >
                          <Link
                            className="min-w-0 truncate underline-offset-2 hover:underline"
                            href={`/government/parliament/motions/${r.code}`}
                          >
                            {r.title}
                          </Link>
                          <Pill
                            tone={
                              r.position === "yes"
                                ? "good"
                                : r.position === "no"
                                  ? "bad"
                                  : "warn"
                            }
                          >
                            {words(r.position)}
                          </Pill>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Section>
              {d.activity.speeches.length > 0 ? (
                <Section kicker="In the chamber" title="Speeches and questions">
                  <ul className="space-y-2">
                    {d.activity.speeches.map((sp, i) => (
                      <li key={i} className="glass card !py-3 text-sm">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold">
                            {words(sp.kind)}
                            {sp.motion ? ` on ${sp.motion}` : ""}
                          </span>
                          <span className="text-xs text-content-muted">
                            {date(sp.held_on)}
                            {sp.word_count ? ` · ${sp.word_count} words` : ""}
                          </span>
                        </div>
                        <p className="text-content-muted">{sp.summary}</p>
                      </li>
                    ))}
                  </ul>
                </Section>
              ) : null}
              {d.fund ? (
                <Section
                  kicker="Public money"
                  title={`Constituency development fund · ${d.fund.place.name}`}
                  action={
                    <Link
                      className="btn btn-primary"
                      href={placeAt(d.fund.place.path, "finance")}
                    >
                      Everything funded here →
                    </Link>
                  }
                >
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="glass card">
                      <p className="kicker">Latest year</p>
                      <p className="num font-display text-3xl">
                        <Money value={d.fund.latestYear?.total} />
                      </p>
                      <p className="text-sm text-content-muted">
                        {d.fund.latestYear?.year} allocation ·{" "}
                        {d.fund.infrastructure.projects} projects ·{" "}
                        {pct(d.fund.infrastructure.completionRate, 0)} completed
                      </p>
                    </div>
                    <div className="glass card">
                      <BarList
                        items={d.fund.classes
                          .slice(0, 5)
                          .map((c) => ({ label: c.label, value: c.amount }))}
                        unit="money"
                      />
                    </div>
                  </div>
                </Section>
              ) : null}
              {d.offices.length > 1 ? (
                <Section title="Offices held" kicker="Career">
                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {d.offices.map((o) => (
                      <li key={o.holderId} className="glass card !py-3">
                        <span className="font-semibold">{o.office}</span>
                        <span className="text-content-muted">
                          {o.unit ? ` · ${o.unit}` : ""}
                        </span>
                        <span className="block text-xs text-content-muted">
                          {date(o.tookOfficeOn)} –{" "}
                          {o.leftOfficeOn ? date(o.leftOfficeOn) : "now"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Section>
              ) : null}
              {d.media.length > 0 ? (
                <Section title="Pictures and posts" kicker="Media">
                  <Gallery items={d.media} />
                </Section>
              ) : null}
              {d.evidence.length > 0 ? (
                <Section kicker="Sources" title="Evidence">
                  <ul className="space-y-2 text-sm">
                    {d.evidence.map((e) => (
                      <li key={e.citationId}>
                        <Link
                          className="underline"
                          href={`/data/sources?citationId=${e.citationId}`}
                        >
                          {e.sourceName}
                        </Link>{" "}
                        <span className="text-content-muted">
                          · {e.locator}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Section>
              ) : null}
              <p className="mt-8 flex items-center gap-3 text-sm text-content-muted">
                <ReactionButton
                  table="official.individuals"
                  subject={l.individualId}
                />
                <LikeLeader
                  leader={{
                    id: l.holderId,
                    name: l.name,
                    office: l.office,
                    unitId: l.unitId,
                  }}
                />{" "}
                Follow this leader
                <ViewBeacon
                  table="official.individuals"
                  subject={l.individualId}
                />
              </p>
              <SubjectContentSection
                table="official.individuals"
                code={l.individualId}
                title="About this person"
              />
              <LegalBasisSection table="governance.holders" code={l.holderId} />
              <Gaps items={d.gaps} topic={l.name} />
            </>
          );
        }}
      </Loaded>
    </PageFrame>
  );
}
