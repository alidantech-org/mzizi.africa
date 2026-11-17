"use client";

import { useCallback, useEffect, useState } from "react";

import { DataTable } from "@mzizi/ui-web/components/data-table.tsx";
import { FilterBar } from "@mzizi/ui-web/components/filter-bar.tsx";
import { PageShell, Section } from "@mzizi/ui-web/components/page-shell.tsx";
import { Pagination } from "@mzizi/ui-web/components/pagination.tsx";
import type { FieldSpec, FieldValues, PageWindow } from "@mzizi/ui-web/lib/types.ts";
import { listJobs, listJobsPage, listJobsRequest } from "#/lib/api/engine/list-jobs.ts";

/** Recent engine jobs, newest first. */
const filterFields: readonly FieldSpec[] = [];

const columns = [
  { key: "attempts", label: "Attempts" },
  { key: "error", label: "Error" },
  { key: "id", label: "Id" },
  { key: "kind", label: "Kind" },
  { key: "runId", label: "Run Id" },
  { key: "status", label: "Status" },
];

type Row = Record<string, unknown>;

const PAGE_SIZE = 20;

export default function JobListPage() {
  const [filters, setFilters] = useState<FieldValues>({});
  const [window, setWindow] = useState<PageWindow>({ limit: PAGE_SIZE, offset: 0 });
  const [rows, setRows] = useState<readonly Row[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const paging = listJobsPage;
    const input: Record<string, unknown> = {};
    for (const [name, value] of Object.entries(filters)) if (value !== "") input[name] = value;
    if (paging !== undefined) {
      input[paging.limit] = Math.min(window.limit, paging.maxLimit);
      input[paging.offset] = window.offset;
    }
    const response = await listJobs(listJobsRequest({ input: input as never }) as never);
    if (!response.success) {
      setError(response.message);
      setRows([]);
      return;
    }
    setError(null);
    const body = response.body as Record<string, unknown> | null;
    setRows((body?.["jobs"] as readonly Row[] | undefined) ?? []);
  }, [filters, window]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <PageShell title="Job List">
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
