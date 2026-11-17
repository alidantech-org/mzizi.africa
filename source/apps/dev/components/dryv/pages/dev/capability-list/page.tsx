"use client";

import { useCallback, useEffect, useState } from "react";

import { DataTable } from "@mzizi/ui-web/components/data-table.tsx";
import { FilterBar } from "@mzizi/ui-web/components/filter-bar.tsx";
import { PageShell, Section } from "@mzizi/ui-web/components/page-shell.tsx";
import { Pagination } from "@mzizi/ui-web/components/pagination.tsx";
import type { FieldSpec, FieldValues, PageWindow } from "@mzizi/ui-web/lib/types.ts";
import {
  listCapabilities,
  listCapabilitiesPage,
  listCapabilitiesRequest,
} from "#/lib/api/engine/list-capabilities.ts";

/** Capability List */
const filterFields: readonly FieldSpec[] = [];

const columns = [
  { key: "description", label: "Description" },
  { key: "name", label: "Name" },
  { key: "package", label: "Package" },
  { key: "version", label: "Version" },
];

type Row = Record<string, unknown>;

const PAGE_SIZE = 20;

export default function CapabilityListPage() {
  const [filters, setFilters] = useState<FieldValues>({});
  const [window, setWindow] = useState<PageWindow>({ limit: PAGE_SIZE, offset: 0 });
  const [rows, setRows] = useState<readonly Row[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const paging = listCapabilitiesPage;
    const input: Record<string, unknown> = {};
    for (const [name, value] of Object.entries(filters)) if (value !== "") input[name] = value;
    if (paging !== undefined) {
      input[paging.limit] = Math.min(window.limit, paging.maxLimit);
      input[paging.offset] = window.offset;
    }
    const response = await listCapabilities(
      listCapabilitiesRequest({ input: input as never }) as never,
    );
    if (!response.success) {
      setError(response.message);
      setRows([]);
      return;
    }
    setError(null);
    const body = response.body as Record<string, unknown> | null;
    setRows((body?.["capabilities"] as readonly Row[] | undefined) ?? []);
  }, [filters, window]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <PageShell title="Capability List">
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
          emptyText="Nothing matches."
        />
        <Pagination window={window} received={rows.length} onChange={setWindow} />
      </Section>
    </PageShell>
  );
}
