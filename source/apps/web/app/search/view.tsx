"use client";

/** Route `/search`: every match across places, leaders, parties, projects, tenders, statistics, sources and laws, each labelled. */
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { AsyncView } from "#/components/site/async-view.tsx";
import { GlobalSearchBox } from "#/components/site/global-search-box.tsx";
import { Avatar } from "#/components/site/ui/media.tsx";
import { Breadcrumbs, PageFrame } from "#/components/site/ui/primitives.tsx";
import { hrefFor } from "#/lib/site/hit-links.ts";
import { search } from "#/lib/site/insights.ts";
import { useAsync } from "#/lib/site/use-async.ts";

const LABEL: Record<string, string> = { place: "Places", leader: "Leaders", party: "Parties", project: "Projects", tender: "Tenders", indicator: "Statistics", source: "Sources", law: "Laws" };

function Results() {
  const q = useSearchParams().get("q") ?? "";
  const [kind, setKind] = useState<string>("all");
  const loaded = useAsync(() => (q.length >= 2 ? search(q, undefined, 60) : Promise.reject(new Error("Type at least two letters."))), `search-${q}`);
  return (
    <PageFrame>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }, { label: q || "…" }]} />
      <h1 className="hero-title text-4xl">Search everything</h1>
      <div className="my-5 max-w-2xl"><GlobalSearchBox autoFocus /></div>
      <AsyncView loaded={loaded}>
        {(data) => {
          const shown = data.hits.filter((h) => kind === "all" || h.kind === kind);
          return (
            <>
              <div role="tablist" aria-label="Filter by kind" className="mb-5 flex flex-wrap gap-2">
                <button className="tab" data-active={kind === "all"} onClick={() => setKind("all")}>All · {data.total}</button>
                {Object.entries(data.counts).filter(([, c]) => c > 0).map(([k, c]) => (
                  <button key={k} className="tab" data-active={kind === k} onClick={() => setKind(k)}>{LABEL[k] ?? k} · {c}</button>
                ))}
              </div>
              {shown.length === 0 ? <p className="text-content-muted">Nothing matches “{data.query}”. Try a place, a leader, a party or a project name.</p> : null}
              <ul className="grid gap-3 md:grid-cols-2">
                {shown.map((hit) => (
                  <li key={`${hit.kind}-${hit.id}`}>
                    <Link href={hrefFor(hit)} className="glass card card-lift flex items-center gap-4">
                      {hit.kind === "leader" ? <Avatar src={hit.imageUrl} name={hit.title} /> : null}
                      <span className="min-w-0 flex-1">
                        <span className="chip mb-1.5">{hit.kindLabel}</span>
                        <span className="block truncate font-display text-xl">{hit.title}</span>
                        <span className="block truncate text-sm text-content-muted">{hit.subtitle ?? ""}</span>
                        {hit.path.length > 1 ? <span className="mt-1 block truncate text-xs text-content-muted">{hit.path.slice(1).join(" › ")}</span> : null}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          );
        }}
      </AsyncView>
    </PageFrame>
  );
}

export default function SearchRoute() {
  return <Suspense><Results /></Suspense>;
}
