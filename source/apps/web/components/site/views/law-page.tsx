/** A legal instrument's overview (`/government/law/<instrument>`) or one of its provisions (`/government/law/provision/<code>`). A server component. */
import Link from "next/link";

import { ContentArticle, ContentLinks, Empty } from "#/components/site/governance/shared.tsx";
import { Loaded } from "#/components/site/loaded.tsx";
import { Breadcrumbs, Gaps, PageFrame, Section } from "#/components/site/ui/primitives.tsx";
import { serverLanguage } from "#/lib/server/data.ts";
import { content } from "#/lib/site/governance/reads.ts";
import { law } from "#/lib/site/insights.ts";

async function read(instrument: string | undefined, provision: string | undefined, language: string) {
  const [text, list] = await Promise.all([
    content(provision ? { slug: `legal/${provision}`, languageCode: language } : { subjectTable: "legal.instruments", subjectCode: instrument ?? "", languageCode: language }),
    instrument ? law() : Promise.resolve(null),
  ]);
  return { text, name: list?.instruments.find((i) => i.code === instrument)?.name ?? null };
}

export async function LawPage({ instrument, provision }: { instrument?: string; provision?: string }) {
  const language = await serverLanguage();
  return (
    <PageFrame>
      <Loaded read={() => read(instrument, provision, language)}>
        {({ text: d, name }) => {
          const title = name ?? d.content?.title ?? (provision ? "Legal provision" : "Law");
          return (
            <>
              <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Law", href: "/government/law" }, { label: provision ? "Legal provision" : title }]} />
              <p className="kicker">Legal foundations</p>
              <h1 className="hero-title text-4xl sm:text-5xl">{title}</h1>
              <p className="mt-3 mb-7 max-w-3xl text-content-muted">Read the available legal text and follow its connections to institutions, leaders and places. Missing provisions and unreviewed explanations remain visible.</p>
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
      </Loaded>
    </PageFrame>
  );
}
