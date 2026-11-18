"use client";

/** Route `/place-search`. Scaffolded by Dryv once; this file belongs to the app. */
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { AsyncView } from "#/components/site/async-view.tsx";
import { PlaceSearchBox } from "#/components/site/place-search-box.tsx";
import { findPlaces } from "#/lib/site/api.ts";
import { useLanguage } from "#/lib/site/i18n.tsx";
import { useAsync } from "#/lib/site/use-async.ts";
import { routes } from "#/lib/dryv/routes.ts";

function Results({ query }: { query: string }) {
  const { language, t } = useLanguage();
  const loaded = useAsync(() => findPlaces(query, language), `${query}|${language}`);
  return (
    <AsyncView loaded={loaded}>
      {(matches) =>
        matches.places.length === 0 ? (
          <p className="text-content-muted">{t("noResults")}</p>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {matches.places.map((place) => (
              <li key={place.featureId}>
                <Link
                  href={`${routes.placeProfile}?featureId=${place.featureId}`}
                  className="flex items-center justify-between rounded-[var(--radius)] border border-border-default bg-surface-elevated px-5 py-4 shadow-[var(--shadow)] transition hover:border-clay"
                >
                  <span className="font-display text-lg">{place.name}</span>
                  <span className="rounded-full bg-surface-sunken px-3 py-1 text-xs font-medium text-content-muted">
                    {place.kindLabel}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )
      }
    </AsyncView>
  );
}

function PlaceSearch() {
  const query = useSearchParams().get("q") ?? "";
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="text-3xl">{t("navPlaces")}</h1>
      <div className="mt-6">
        <PlaceSearchBox key={query} initial={query} />
      </div>
      <div className="mt-8">{query.length >= 2 ? <Results query={query} /> : null}</div>
    </div>
  );
}

export default function PlaceSearchRoute() {
  return (
    <Suspense>
      <PlaceSearch />
    </Suspense>
  );
}
