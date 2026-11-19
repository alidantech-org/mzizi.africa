/** Route `/content`: explanatory articles, found by the categories and tags in the content catalogue. A server page; the filters are a client leaf. */
import { ArticleList } from "#/components/site/article-list.tsx";
import { Loaded } from "#/components/site/loaded.tsx";
import { Breadcrumbs, PageFrame } from "#/components/site/ui/primitives.tsx";
import { serverLanguage } from "#/lib/server/data.ts";
import { library } from "#/lib/site/governance/reads.ts";

export const dynamic = "force-dynamic";

export default async function ContentLibrary({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const { tag } = await searchParams;
  const language = await serverLanguage();
  return (
    <PageFrame>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Knowledge library" }]} />
      <p className="kicker">Knowledge library</p>
      <h1 className="hero-title text-4xl sm:text-5xl">Understand the connections</h1>
      <p className="mt-3 text-content-muted">Explanations, biographies and background from the content catalogue.{tag ? ` Tag: ${tag}.` : ""}</p>
      <Loaded read={() => library({ languageCode: language, tag, limit: 200 })}>{(d) => <ArticleList d={d} />}</Loaded>
    </PageFrame>
  );
}
