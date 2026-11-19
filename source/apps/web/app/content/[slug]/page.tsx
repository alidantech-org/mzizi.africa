/** `/content/<slug>`: one explanatory article. A server page; Markdown renders as safe React elements, linked media resolved by the API. */
import { ContentArticle, ContentLinks, Empty, LegalBasisSection } from "#/components/site/governance/shared.tsx";
import { Loaded } from "#/components/site/loaded.tsx";
import { Breadcrumbs, Gaps, PageFrame, Section } from "#/components/site/ui/primitives.tsx";
import { serverLanguage } from "#/lib/server/data.ts";
import { contentSlug } from "#/lib/site/governance/content-slug.ts";
import { content } from "#/lib/site/governance/reads.ts";

export const dynamic = "force-dynamic";

export default async function ContentRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const language = await serverLanguage();
  return (
    <PageFrame>
      <Loaded read={() => content({ slug: contentSlug(slug), languageCode: language })}>
        {(d) => (
          <>
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Knowledge library", href: "/content" }, { label: d.content?.title ?? "Article unavailable" }]} />
            {d.content ? (
              <>
                <p className="kicker">{d.content.category.label}</p>
                <h1 className="hero-title mb-5 text-3xl sm:text-5xl">{d.content.title}</h1>
                {d.content.summary ? <p className="mb-6 max-w-3xl text-lg text-content-muted">{d.content.summary}</p> : null}
                <ContentArticle item={d.content} />
                {d.content.subject.code && !d.content.subject.table.startsWith("legal.") ? <LegalBasisSection table={d.content.subject.table} code={d.content.subject.code} /> : null}
              </>
            ) : (
              <Empty title="This article is not available">Its text has not been recorded or this address is no longer valid.</Empty>
            )}
            {d.related.length > 0 ? <Section title="Continue exploring"><ContentLinks items={d.related} /></Section> : null}
            <Gaps items={d.gaps} />
          </>
        )}
      </Loaded>
    </PageFrame>
  );
}
