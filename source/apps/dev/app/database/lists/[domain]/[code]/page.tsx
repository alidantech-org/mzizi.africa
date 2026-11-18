"use client";

/** Route `/database/lists/<domain>/<list>`: one curated data list, paged. */
import { useParams } from "next/navigation";
import { useState } from "react";

import { AsyncView } from "#/components/portal/async-view.tsx";
import { Crumbs, Grid, Pager } from "#/components/portal/ui.tsx";
import { explore } from "#/lib/portal/explore.ts";
import { useAsync } from "#/lib/portal/use-async.ts";

export default function ListRoute() {
  const { domain, code } = useParams<{ domain: string; code: string }>();
  const [offset, setOffset] = useState(0);
  const loaded = useAsync(() => explore.list_page(domain, code, 50, offset), `${domain}/${code}|${offset}`);
  return (
    <div className="space-y-4">
      <Crumbs items={[{ href: "/database", label: "Database" }, { label: domain }, { label: code }]} />
      <AsyncView loaded={loaded}>
        {(page) => (
          <>
            <div>
              <h2 className="font-display text-2xl">{page.list.title}</h2>
              <p className="text-sm text-content-muted">{page.list.describe}</p>
            </div>
            <Grid header={page.list.columns} rows={page.rows.map((row) => page.list.columns.map((c) => (row[c] as string | number | boolean | null) ?? null))} caption={page.list.title} />
            <Pager offset={page.offset} limit={page.limit} total={page.total} onChange={setOffset} />
          </>
        )}
      </AsyncView>
    </div>
  );
}
