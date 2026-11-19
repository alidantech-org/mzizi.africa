/** Route `/data/sources`: the data sources behind the platform, with how many artifacts and citations each holds. A server page; search is a plain GET form. */
import { Loaded } from "#/components/site/loaded.tsx";
import { Breadcrumbs, PageFrame } from "#/components/site/ui/primitives.tsx";
import { listSources } from "#/lib/site/api.ts";
import { T } from "#/lib/site/i18n.tsx";

export const dynamic = "force-dynamic";

export default async function SourcesRoute({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  return (
    <PageFrame>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Data", href: "/data/statistics" }, { label: "Sources" }]} />
      <h1 className="hero-title text-4xl sm:text-5xl"><T>{"Sources"}</T></h1>
      <p className="mt-2 max-w-2xl text-content-muted"><T>{"Where the records come from. Every claim in the platform links to its evidence."}</T></p>
      <form role="search" method="get" className="mt-6">
        <input name="q" defaultValue={q} placeholder="Search sources" aria-label="Search sources" className="input w-full max-w-md" />
      </form>
      <div className="mt-8">
        <Loaded read={() => listSources(q)}>
          {(result) => (
            <ul className="glass card divide-y divide-[var(--border-default)] !p-0">
              {result.sources.map((source) => (
                <li key={source.sourceId} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                  <div className="min-w-0">
                    <p className="font-medium">{source.name}</p>
                    <p className="text-sm text-content-muted">{source.publisherName ?? source.code}</p>
                  </div>
                  <p className="text-sm text-content-muted">{source.artifactCount} artifacts · {source.citationCount} citations</p>
                </li>
              ))}
            </ul>
          )}
        </Loaded>
      </div>
    </PageFrame>
  );
}
