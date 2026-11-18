"use client";

/** Route `/database`: meaningful data lists and the raw tables, grouped by domain. */
import Link from "next/link";
import { useState } from "react";

import { AsyncView } from "#/components/portal/async-view.tsx";
import { Card, field } from "#/components/portal/ui.tsx";
import { explore } from "#/lib/portal/explore.ts";
import { useAsync } from "#/lib/portal/use-async.ts";

export default function DatabaseRoute() {
  const [filter, setFilter] = useState("");
  const loaded = useAsync(async () => ({ domains: await explore.domains(), lists: await explore.lists() }), "database");
  return (
    <div className="space-y-6">
      <input className={`${field} max-w-sm`} placeholder="Filter tables and lists…" value={filter} onChange={(e) => setFilter(e.target.value.toLowerCase())} />
      <AsyncView loaded={loaded}>
        {({ domains, lists }) => (
          <>
            <section>
              <h2 className="mb-2 font-display text-xl">Data lists</h2>
              <p className="mb-3 text-sm text-content-muted">Ready-made views that join the tables into something readable.</p>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {lists.filter((l) => `${l.title} ${l.domain} ${l.describe}`.toLowerCase().includes(filter)).map((list) => (
                  <Link key={`${list.domain}/${list.code}`} href={`/database/lists/${list.domain}/${list.code}`} className="rounded-xl border border-border-default bg-surface-elevated p-4 transition hover:-translate-y-0.5 hover:shadow-md">
                    <p className="text-[11px] uppercase tracking-widest text-clay">{list.domain}</p>
                    <p className="font-display text-lg">{list.title}</p>
                    <p className="mt-1 text-sm text-content-muted">{list.describe}</p>
                  </Link>
                ))}
              </div>
            </section>
            <section>
              <h2 className="mb-2 font-display text-xl">Raw tables</h2>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {domains.map((domain) => {
                  const tables = domain.tables.filter((t) => `${domain.domain}.${t.name}`.includes(filter));
                  if (tables.length === 0) return null;
                  return (
                    <Card key={domain.domain} title={`${domain.domain} · ${tables.length}`}>
                      <ul className="space-y-0.5 text-sm">
                        {tables.map((table) => (
                          <li key={table.name}>
                            <Link href={`/database/${domain.domain}/${table.name}`} className="flex justify-between gap-2 rounded px-2 py-1 hover:bg-surface-sunken">
                              <span>{table.name}</span>
                              <span className="text-xs text-content-muted">{table.rows.toLocaleString()} rows</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </AsyncView>
    </div>
  );
}
