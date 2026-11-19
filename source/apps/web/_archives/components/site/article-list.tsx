"use client";

/** The article list with its search and category filters; the only client part of the library page. */
import { useState } from "react";
import type { InsightsContentList } from "@mzizi/api-client/types/insights/content-list.ts";
import {
  ContentLinks,
  Empty,
} from "#/_archives/components/site/governance/shared";
import { Gaps } from "#/_archives/components/site/ui/primitives";

export function ArticleList({ d }: { d: InsightsContentList }) {
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const q = query.toLocaleLowerCase();
  const items = d.items.filter(
    (i) =>
      (!category || i.category.code === category) &&
      (!q || `${i.title} ${i.summary ?? ""}`.toLocaleLowerCase().includes(q)),
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
          <span className="mb-1 block text-sm font-semibold">Category</span>
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
        <Empty title="No articles match">Try another category or search.</Empty>
      )}
      <Gaps items={d.gaps} />
    </>
  );
}
