"use client";

/** The places inside a place, grouped by kind, with a filter when the list is long. The only interactive part of the places page. */
import Link from "next/link";
import { useMemo, useState } from "react";

import { Icon } from "#/_archives/components/brand/icon";
import { n, short } from "#/_archives/lib/site/format";
import { placeAt } from "#/_archives/lib/site/links";
import type { Child } from "#/_archives/lib/site/insights";

export function ChildGroups({ children }: { children: readonly Child[] }) {
  const [filter, setFilter] = useState("");
  const kids = useMemo(
    () =>
      children.filter((c) =>
        c.name.toLowerCase().includes(filter.toLowerCase()),
      ),
    [children, filter],
  );
  const groups = useMemo(() => {
    const map = new Map<string, Child[]>();
    for (const k of kids)
      map.set(k.kindLabel, [...(map.get(k.kindLabel) ?? []), k]);
    return [...map.entries()];
  }, [kids]);
  return (
    <>
      {children.length > 8 ? (
        <label className="glass mt-6 flex max-w-sm items-center gap-2 rounded-full px-4 py-2">
          <Icon name="search" size={18} />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter this list"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            aria-label="Filter this list"
          />
        </label>
      ) : null}
      {groups.map(([label, list]) => (
        <section key={label} className="mt-8">
          <h2 className="mb-3 font-display text-xl text-content-muted">
            {label}s <span className="num text-base">· {list.length}</span>
          </h2>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((child) => (
              <li key={child.featureId}>
                <Link
                  href={placeAt(
                    child.path,
                    child.childCount > 0 ? "places" : "",
                  )}
                  className="glass card card-lift flex items-center justify-between gap-3"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-display text-lg">
                      {child.name}
                    </span>
                    <span className="text-xs text-content-muted">
                      {child.kindLabel}
                      {child.childCount > 0
                        ? ` · ${n(child.childCount)} inside`
                        : ""}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="num block text-sm font-semibold">
                      {short(child.population)}
                    </span>
                    <span className="text-[10px] uppercase tracking-wide text-content-muted">
                      people
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
