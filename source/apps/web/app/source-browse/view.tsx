"use client";

/** Route `/source-browse`. Scaffolded by Dryv once; this file belongs to the app. */
import { useState } from "react";

import { AsyncView } from "#/components/site/async-view.tsx";
import { listSources } from "#/lib/site/api.ts";
import { useLanguage } from "#/lib/site/i18n.tsx";
import { useAsync } from "#/lib/site/use-async.ts";

export default function SourceBrowseRoute() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const loaded = useAsync(() => listSources(query), query);
  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <h1 className="text-3xl">{t("sources")}</h1>
      <p className="mt-2 max-w-2xl text-content-muted">{t("sourcesBody")}</p>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t("searchSources")}
        aria-label={t("searchSources")}
        className="mt-6 w-full max-w-md rounded-full border border-border-default bg-surface-elevated px-5 py-3 outline-none focus:border-clay"
      />
      <div className="mt-8">
        <AsyncView loaded={loaded}>
          {(result) => (
            <ul className="divide-y divide-border-default rounded-[var(--radius)] border border-border-default bg-surface-elevated shadow-[var(--shadow)]">
              {result.sources.map((source) => (
                <li
                  key={source.sourceId}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                >
                  <div className="min-w-0">
                    <p className="font-medium">{source.name}</p>
                    <p className="text-sm text-content-muted">
                      {source.publisherName ?? source.code}
                    </p>
                  </div>
                  <p className="text-sm text-content-muted">
                    {source.artifactCount} {t("artifacts")} · {source.citationCount}{" "}
                    {t("citations")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </AsyncView>
      </div>
    </div>
  );
}
