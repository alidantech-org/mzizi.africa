"use client";

/** Explanatory articles are discovered by the categories and tags in the content catalogue. */
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AsyncView } from "#/components/site/async-view.tsx";
import { ContentLinks, Empty } from "#/components/site/governance/shared.tsx";
import {
  Breadcrumbs,
  Gaps,
  Loading,
  PageFrame,
} from "#/components/site/ui/primitives.tsx";
import { library } from "#/lib/site/governance/reads.ts";
import { useLanguage } from "#/lib/site/i18n.tsx";
import { useAsync } from "#/lib/site/use-async.ts";
function Body() {
  const tag = useSearchParams().get("tag") ?? undefined;
  const { language } = useLanguage();
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const loaded = useAsync(
    () => library({ languageCode: language, tag, limit: 200 }),
    `content:${language}:${tag}`,
  );
  return (
    <PageFrame>
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Knowledge library" }]}
      />
      <p className="kicker">Knowledge library</p>
      <h1 className="hero-title text-4xl sm:text-5xl">
        Understand the connections
      </h1>
      <p className="mt-3 text-content-muted">
        Explanations, biographies and background from the content catalogue.
        {tag ? ` Tag: ${tag}.` : ""}
      </p>
      <AsyncView loaded={loaded}>
        {(d) => {
          const q = query.toLocaleLowerCase();
          const items = d.items.filter(
            (i) =>
              (!category || i.category.code === category) &&
              (!q ||
                `${i.title} ${i.summary ?? ""}`
                  .toLocaleLowerCase()
                  .includes(q)),
          );
          return (
            <>
              <div className="my-7 grid gap-3 sm:grid-cols-2">
                <label>
                  <span className="mb-1 block text-sm font-semibold">
                    Find an article
                  </span>
                  <input
                    className="input w-full"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <label>
                  <span className="mb-1 block text-sm font-semibold">
                    Category
                  </span>
                  <select
                    className="input w-full"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">All categories</option>
                    {d.categories.map((c) => (
                      <option value={c.code} key={c.code}>
                        {c.label} · {c.count}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              {items.length > 0 ? (
                <ContentLinks items={items} />
              ) : (
                <Empty title="No articles match">
                  Try another category or search.
                </Empty>
              )}
              <Gaps items={d.gaps} />
            </>
          );
        }}
      </AsyncView>
    </PageFrame>
  );
}
export default function ContentRoute() {
  return (
    <Suspense
      fallback={
        <PageFrame>
          <Loading />
        </PageFrame>
      }
    >
      <Body />
    </Suspense>
  );
}
