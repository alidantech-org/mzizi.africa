/** One institution connects responsibility, relationships, current holders, explanatory content and legal effects. */
import Link from "next/link";
import { leaderAt } from "#/_archives/lib/site/links";
import { Loaded } from "#/_archives/components/site/loaded";
import {
  ContentArticle,
  DevelopmentNote,
  Empty,
  LegalItems,
} from "#/_archives/components/site/governance/shared";
import { Avatar } from "#/_archives/components/site/ui/media";
import {
  Breadcrumbs,
  Gaps,
  PageFrame,
  Pill,
  Section,
} from "#/_archives/components/site/ui/primitives";
import { serverLanguage } from "#/_archives/lib/server/data";
import { institution } from "#/_archives/lib/site/governance/reads";

export const dynamic = "force-dynamic";

export default async function InstitutionRoute({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const language = await serverLanguage();
  return (
    <PageFrame>
      <Loaded read={() => institution(decodeURIComponent(code), language)}>
        {(d) => (
          <>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Institutions", href: "/government/institutions" },
                { label: d.institution.name },
              ]}
            />
            <p className="kicker">
              {d.institution.arm?.label} · {d.institution.kind.label}
            </p>
            <div className="mt-3 flex items-start gap-4">
              <Avatar
                name={d.institution.name}
                src={d.institution.image}
                size={72}
              />
              <h1 className="hero-title text-3xl sm:text-5xl">
                {d.institution.name}
              </h1>
            </div>
            <p className="mt-5 max-w-3xl text-lg text-content-muted">
              {d.institution.purpose ??
                "The purpose of this institution has not been recorded yet."}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Pill>
                {d.institution.basis?.label ??
                  "Establishment basis not recorded"}
              </Pill>
              {d.institution.established ? (
                <span className="text-sm text-content-muted">
                  Established {d.institution.established}
                </span>
              ) : null}
              <Link
                className="btn btn-primary"
                href={`/leaders?institution=${encodeURIComponent(code)}`}
              >
                Explore leadership tree →
              </Link>
            </div>
            <DevelopmentNote />
            {d.metrics.length > 0 ? (
              <Section title="Available measures" kicker="What is on record">
                <dl className="grid gap-4 sm:grid-cols-2">
                  {d.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-2xl border border-[var(--border-default)] p-5"
                    >
                      <dt className="text-sm text-content-muted">
                        {metric.label}
                      </dt>
                      <dd className="num mt-1 font-display text-3xl">
                        {metric.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 text-xs text-content-muted">
                  These are the available recorded measures. Counts are not
                  funding figures or performance rankings.
                </p>
              </Section>
            ) : null}
            {d.institution.functions.length > 0 ? (
              <Section title="Responsibilities">
                <ul className="list-disc space-y-2 pl-5 leading-relaxed">
                  {d.institution.functions.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </Section>
            ) : null}
            <Section title="Leadership">
              <ul className="grid gap-x-8 divide-y divide-[var(--border-default)] sm:grid-cols-2">
                {d.leaders.map((l) => (
                  <li className="py-4" key={l.holderId}>
                    <Link
                      className="flex items-center gap-3"
                      href={leaderAt(l)}
                    >
                      <Avatar src={l.photo} name={l.name} size={48} />
                      <span>
                        <strong className="block">{l.name}</strong>
                        <span className="block text-sm text-content-muted">
                          {l.tier.label} · {l.how.label}
                        </span>
                        <span className="text-xs text-content-muted">
                          {l.unit?.name}
                          {l.party ? ` · ${l.party}` : ""}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              {d.leaders.length === 0 ? (
                <Empty title="No current leaders recorded">
                  The institution is available to explore; its holders have not
                  been recorded.
                </Empty>
              ) : null}
            </Section>
            <Section
              title="Legal basis"
              kicker="What establishes and governs it"
            >
              <LegalItems items={d.legalBasis} />
            </Section>
            {d.content.map((c) => (
              <Section
                key={c.slug}
                title={c.title}
                kicker="Understand this body"
              >
                <ContentArticle item={c} />
              </Section>
            ))}
            {d.parents.length > 0 || d.children.length > 0 ? (
              <Section title="Connected institutions">
                <ul className="divide-y divide-[var(--border-default)]">
                  {[...d.parents, ...d.children].map((r, index) => (
                    <li key={`${r.code}-${index}`} className="py-3">
                      <Link
                        className="flex justify-between gap-3"
                        href={`/government/institutions/${encodeURIComponent(r.code)}`}
                      >
                        <span className="font-semibold">{r.name}</span>
                        <span className="text-sm text-content-muted">
                          {r.relation.label} ↗
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Section>
            ) : null}
            <Gaps items={d.gaps} topic={d.institution.name} />
          </>
        )}
      </Loaded>
    </PageFrame>
  );
}
