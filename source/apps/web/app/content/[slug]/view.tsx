"use client";

/** Markdown is rendered as safe React elements, with linked media resolved by the backend. */
import { useParams } from "next/navigation";
import { AsyncView } from "#/components/site/async-view.tsx";
import {
  ContentArticle,
  ContentLinks,
  Empty,
  LegalBasisSection,
} from "#/components/site/governance/shared.tsx";
import {
  Breadcrumbs,
  Gaps,
  PageFrame,
  Section,
} from "#/components/site/ui/primitives.tsx";
import { content } from "#/lib/site/governance/reads.ts";
import { contentSlug } from "#/lib/site/governance/parse/documents.ts";
import { useLanguage } from "#/lib/site/i18n.tsx";
import { useAsync } from "#/lib/site/use-async.ts";
export default function ContentRoute() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const loaded = useAsync(
    async () => content({ slug: contentSlug(slug), languageCode: language }),
    `content:${slug}:${language}`,
  );
  return (
    <PageFrame>
      <AsyncView loaded={loaded}>
        {(d) => (
          <>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Knowledge library", href: "/content" },
                { label: d.content?.title ?? "Article unavailable" },
              ]}
            />
            {d.content ? (
              <>
                <p className="kicker">{d.content.category.label}</p>
                <h1 className="hero-title mb-5 text-3xl sm:text-5xl">
                  {d.content.title}
                </h1>
                {d.content.summary ? (
                  <p className="mb-6 max-w-3xl text-lg text-content-muted">
                    {d.content.summary}
                  </p>
                ) : null}
                <ContentArticle item={d.content} />
                {d.content.subject.code &&
                !d.content.subject.table.startsWith("legal.") ? (
                  <LegalBasisSection
                    table={d.content.subject.table}
                    code={d.content.subject.code}
                  />
                ) : null}
              </>
            ) : (
              <Empty title="This article is not available">
                Its text has not been recorded or this address is no longer
                valid.
              </Empty>
            )}
            {d.related.length > 0 ? (
              <Section title="Continue exploring">
                <ContentLinks items={d.related} />
              </Section>
            ) : null}
            <Gaps items={d.gaps} />
          </>
        )}
      </AsyncView>
    </PageFrame>
  );
}
