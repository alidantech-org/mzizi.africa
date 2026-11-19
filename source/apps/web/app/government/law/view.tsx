"use client";

/** A legal instrument's overview (`/government/law/<instrument>`) or one of its provisions (`/government/law/provision/<code>`), from the content operation. */
import Link from "next/link";

import { AsyncView } from "#/components/site/async-view.tsx";
import { ContentArticle, ContentLinks, Empty } from "#/components/site/governance/shared.tsx";
import { Breadcrumbs, Gaps, PageFrame, Section } from "#/components/site/ui/primitives.tsx";
import { content } from "#/lib/site/governance/reads.ts";
import { useLanguage } from "#/lib/site/i18n.tsx";
import { law } from "#/lib/site/insights.ts";
import { useAsync } from "#/lib/site/use-async.ts";

export default function LawView({ instrument, provision }: { instrument?: string; provision?: string }) {
  const { language } = useLanguage();
  const key = `law:${language}:${instrument ?? ""}:${provision ?? ""}`;
  const loaded = useAsync(async () => {
    const [text, list] = await Promise.all([
      content(provision ? { slug: `legal/${provision}`, languageCode: language } : { subjectTable: "legal.instruments", subjectCode: instrument ?? "", languageCode: language }),
      instrument ? law() : Promise.resolve(null),
    ]);
    return { text, name: list?.instruments.find((i) => i.code === instrument)?.name ?? null };
  }, key);
  return (
    <PageFrame>
      <AsyncView loaded={loaded}>
        {({ text: d, name }) => {
          const title = name ?? d.content?.title ?? (provision ? "Legal provision" : "Law");
          return (
            <>
              <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Law", href: "/government/law" }, { label: provision ? "Legal provision" : title }]} />
              <p className="kicker">Legal foundations</p>
              <h1 className="hero-title text-4xl sm:text-5xl">{title}</h1>
              <p className="mt-3 mb-7 max-w-3xl text-content-muted">
                Read the available legal text and follow its connections to institutions, leaders and places. Missing provisions and unreviewed explanations remain visible.
              </p>
              {d.content ? (
                <>
                  <h2 className="mb-5 font-display text-2xl">{d.content.title}</h2>
                  <ContentArticle item={d.content} />
                </>
              ) : (
                <Empty title="Legal text not available">The legal text or explanatory overview has not been loaded.</Empty>
              )}
              {d.related.length > 0 ? <Section title="Chapters and related reading"><ContentLinks items={d.related} /></Section> : null}
              <Gaps items={d.gaps} topic="law" />
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/government/law" className="btn btn-ghost">← All law</Link>
                <Link href="/government/institutions" className="btn btn-primary">Explore institutions →</Link>
              </div>
            </>
          );
        }}
      </AsyncView>
    </PageFrame>
  );
}
