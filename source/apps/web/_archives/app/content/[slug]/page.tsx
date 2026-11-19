/** `/content/<slug>`: one explanatory article. A server page; Markdown renders as safe React elements, linked media resolved by the API. */
import { LegalBasisSection } from "#/_archives/components/site/governance/server-sections";
import {
  ContentArticle,
  ContentLinks,
  Empty,
} from "#/_archives/components/site/governance/shared";
import { Loaded } from "#/_archives/components/site/loaded";
import {
  Breadcrumbs,
  Gaps,
  PageFrame,
  Section,
} from "#/_archives/components/site/ui/primitives";
import { serverLanguage } from "#/_archives/lib/server/data";
import { contentSlug } from "#/_archives/lib/site/governance/content-slug";
import { content } from "#/_archives/lib/site/governance/reads";

export const dynamic = "force-dynamic";

export default async function ContentRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const language = await serverLanguage();
  return (
    <PageFrame>
      <Loaded
        read={() =>
          content({ slug: contentSlug(slug), languageCode: language })
        }
      >
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
      </Loaded>
    </PageFrame>
  );
}
