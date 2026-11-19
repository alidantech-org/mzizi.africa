/** Route `/search`: every match across places, leaders, parties, projects, tenders, statistics, sources and laws, each labelled. */
import Link from "next/link";

import { Loaded } from "#/_archives/components/site/loaded";
import { GlobalSearchBox } from "#/_archives/components/site/global-search-box";
import { Avatar } from "#/_archives/components/site/ui/media";
import {
  Breadcrumbs,
  PageFrame,
} from "#/_archives/components/site/ui/primitives";
import { hrefFor } from "#/_archives/lib/site/hit-links";
import { search } from "#/_archives/lib/site/insights";

const LABEL: Record<string, string> = {
  place: "Places",
  leader: "Leaders",
  party: "Parties",
  project: "Projects",
  tender: "Tenders",
  indicator: "Statistics",
  source: "Sources",
  law: "Laws",
};

export const dynamic = "force-dynamic";

export default async function SearchRoute({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; kind?: string }>;
}) {
  const { q = "", kind = "all" } = await searchParams;
  const base = `/search?q=${encodeURIComponent(q)}`;
  return (
    <PageFrame>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Search" },
          { label: q || "…" },
        ]}
      />
      <h1 className="hero-title text-4xl">Search everything</h1>
      <div className="my-5 max-w-2xl">
        <GlobalSearchBox autoFocus />
      </div>
      <Loaded
        read={() =>
          q.length >= 2
            ? search(q, undefined, 60)
            : Promise.reject(new Error("Type at least two letters."))
        }
      >
        {(data) => {
          const shown = data.hits.filter(
            (h) => kind === "all" || h.kind === kind,
          );
          return (
            <>
              <div
                role="tablist"
                aria-label="Filter by kind"
                className="mb-5 flex flex-wrap gap-2"
              >
                <Link
                  role="tab"
                  aria-selected={kind === "all"}
                  className="tab"
                  data-active={kind === "all"}
                  href={base}
                >
                  All · {data.total}
                </Link>
                {Object.entries(data.counts)
                  .filter(([, c]) => c > 0)
                  .map(([k, c]) => (
                    <Link
                      key={k}
                      role="tab"
                      aria-selected={kind === k}
                      className="tab"
                      data-active={kind === k}
                      href={`${base}&kind=${k}`}
                    >
                      {LABEL[k] ?? k} · {c}
                    </Link>
                  ))}
              </div>
              {shown.length === 0 ? (
                <p className="text-content-muted">
                  Nothing matches “{data.query}”. Try a place, a leader, a party
                  or a project name.
                </p>
              ) : null}
              <ul className="grid gap-3 md:grid-cols-2">
                {shown.map((hit) => (
                  <li key={`${hit.kind}-${hit.id}`}>
                    <Link
                      href={hrefFor(hit)}
                      className="glass card card-lift flex items-center gap-4"
                    >
                      {hit.kind === "leader" ? (
                        <Avatar src={hit.imageUrl} name={hit.title} />
                      ) : null}
                      <span className="min-w-0 flex-1">
                        <span className="chip mb-1.5">{hit.kindLabel}</span>
                        <span className="block truncate font-display text-xl">
                          {hit.title}
                        </span>
                        <span className="block truncate text-sm text-content-muted">
                          {hit.subtitle ?? ""}
                        </span>
                        {hit.path.length > 1 ? (
                          <span className="mt-1 block truncate text-xs text-content-muted">
                            {hit.path.slice(1).join(" › ")}
                          </span>
                        ) : null}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          );
        }}
      </Loaded>
    </PageFrame>
  );
}
