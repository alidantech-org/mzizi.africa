"use client";

/** Route `/seed-table-list`. Scaffolded by Dryv once; this file belongs to the app. */
import { useState } from "react";

import { AsyncView } from "#/components/portal/async-view.tsx";
import { seedTables } from "#/lib/portal/engine.ts";
import { useAsync } from "#/lib/portal/use-async.ts";

export default function SeedTableListRoute() {
  const loaded = useAsync(seedTables, "seed-tables");
  const [query, setQuery] = useState("");
  return (
    <div className="space-y-5">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Filter tables (for example governance)"
        aria-label="Filter tables"
        className="w-full max-w-md rounded-lg border border-border-default bg-surface-elevated px-4 py-2 text-sm outline-none focus:border-clay"
      />
      <AsyncView loaded={loaded}>
        {(catalog) => {
          const shown = catalog.tables.filter((table) =>
            table.name.includes(query.trim().toLowerCase()),
          );
          return (
            <div className="space-y-3">
              <p className="text-sm text-content-muted">
                {shown.length} of {catalog.tables.length} tables · catalog{" "}
                {catalog.sha256.slice(0, 12)}
              </p>
              {shown.map((table) => (
                <details
                  key={table.name}
                  className="rounded-xl border border-border-default bg-surface-elevated px-5 py-3"
                >
                  <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-sm">{table.name}</span>
                    <span className="text-xs text-content-muted">
                      key: {table.naturalKey.join(", ")} · {table.columns.length} columns
                    </span>
                  </summary>
                  <ul className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
                    {table.columns.map((column) => (
                      <li
                        key={column.name}
                        className="flex justify-between gap-3 border-b border-border-default/60 py-1"
                      >
                        <span className="font-mono text-xs">
                          {column.name}
                          {column.required ? " *" : ""}
                        </span>
                        <span className="text-xs text-content-muted">
                          {column.targetTable ? `→ ${column.targetTable}` : column.kind}
                        </span>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          );
        }}
      </AsyncView>
    </div>
  );
}
