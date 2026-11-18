"use client";

/** Route `/database/<domain>/<table>`: one raw table with search, sorting and paging. */
import { useParams } from "next/navigation";
import { useState } from "react";

import { AsyncView } from "#/components/portal/async-view.tsx";
import { Card, Crumbs, field, Grid, Pager } from "#/components/portal/ui.tsx";
import { explore } from "#/lib/portal/explore.ts";
import { useAsync } from "#/lib/portal/use-async.ts";

export default function TableRoute() {
  const { domain, table } = useParams<{ domain: string; table: string }>();
  const [offset, setOffset] = useState(0);
  const [order, setOrder] = useState("");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const [q, setQ] = useState("");
  const [draft, setDraft] = useState("");
  const limit = 50;
  const loaded = useAsync(() => explore.table(domain, table, { limit, offset, order, direction, q }), `${domain}.${table}|${offset}|${order}|${direction}|${q}`);
  return (
    <div className="space-y-4">
      <Crumbs items={[{ href: "/database", label: "Database" }, { label: domain }, { label: table }]} />
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); setOffset(0); setQ(draft); }}>
        <input className={`${field} max-w-sm`} placeholder="Search every text column…" value={draft} onChange={(e) => setDraft(e.target.value)} />
      </form>
      <AsyncView loaded={loaded}>
        {(page) => (
          <>
            <Card title={`${page.columns.length} columns`}>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {page.columns.map((column) => (
                  <button
                    key={column.name}
                    title={`${column.type}${column.nullable ? "" : " · required"}`}
                    onClick={() => { setOrder(column.name); setDirection(order === column.name && direction === "asc" ? "desc" : "asc"); setOffset(0); }}
                    className={`rounded-full border px-2.5 py-0.5 ${page.order === column.name ? "border-clay bg-clay text-cream" : "border-border-default hover:bg-surface-sunken"}`}
                  >
                    {column.primary ? "🔑 " : ""}{column.name}{page.order === column.name ? (page.direction === "asc" ? " ↑" : " ↓") : ""}
                  </button>
                ))}
              </div>
            </Card>
            <Grid header={page.columns.map((c) => c.name)} rows={page.rows.map((row) => page.columns.map((c) => (row[c.name] as string | number | boolean | null) ?? null))} caption={`${domain}.${table}`} />
            <Pager offset={page.offset} limit={page.limit} total={page.total} onChange={setOffset} />
          </>
        )}
      </AsyncView>
    </div>
  );
}
