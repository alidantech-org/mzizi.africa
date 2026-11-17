"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { DataTable } from "@mzizi/ui-web/components/data-table.tsx";
import { FilterBar } from "@mzizi/ui-web/components/filter-bar.tsx";
import { PageShell, Section } from "@mzizi/ui-web/components/page-shell.tsx";
import { Pagination } from "@mzizi/ui-web/components/pagination.tsx";
import type { FieldSpec, FieldValues, PageWindow } from "@mzizi/ui-web/lib/types.ts";
import { searchLocalities } from "@mzizi/api-client/actions/locality/search-localities.actions.ts";
import {
  searchLocalitiesPage,
  searchLocalitiesRequest,
} from "#/lib/api/locality/search-localities.ts";

/** Find a place by name and open its profile. */
const filterFields: readonly FieldSpec[] = [{ kind: "text", name: "query", label: "Query" }];

const columns = [
  { key: "code", label: "Code" },
  { key: "depth", label: "Depth" },
  { key: "featureId", label: "Feature Id" },
  { key: "kindCode", label: "Kind Code" },
  { key: "kindLabel", label: "Kind Label" },
  { key: "name", label: "Name" },
];

type Row = Record<string, unknown>;

const PAGE_SIZE = 20;

export default function PlaceSearchPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<FieldValues>({});
  const [window, setWindow] = useState<PageWindow>({ limit: PAGE_SIZE, offset: 0 });
  const [rows, setRows] = useState<readonly Row[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const paging = searchLocalitiesPage;
    const input: Record<string, unknown> = {};
    for (const [name, value] of Object.entries(filters)) if (value !== "") input[name] = value;
    if (paging !== undefined) {
      input[paging.limit] = Math.min(window.limit, paging.maxLimit);
      input[paging.offset] = window.offset;
    }
    const response = await searchLocalities(
      searchLocalitiesRequest({ input: input as never }) as never,
    );
    if (!response.success) {
      setError(response.message);
      setRows([]);
      return;
    }
    setError(null);
    const body = response.body as Record<string, unknown> | null;
    setRows((body?.["places"] as readonly Row[] | undefined) ?? []);
  }, [filters, window]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <PageShell title="Place Search">
      <Section>
        <FilterBar
          fields={filterFields}
          initial={filters}
          submitLabel="Apply"
          onSubmit={(values) => {
            setFilters(values);
            setWindow({ limit: window.limit, offset: 0 });
          }}
        />
      </Section>
      <Section>
        {error === null ? null : <p role="alert">{error}</p>}
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(row, index) => String(index)}
          cell={(row, key) => String(row[key] ?? "")}
          onOpen={(row) => {
            // The row's text values travel as the target's context values, matched by name.
            const values = new URLSearchParams();
            for (const [name, value] of Object.entries(row))
              if (typeof value === "string") values.set(name, value);
            router.push(`/place-profile?${values.toString()}`);
          }}
          emptyText="Nothing matches."
        />
        <Pagination window={window} received={rows.length} onChange={setWindow} />
      </Section>
    </PageShell>
  );
}
