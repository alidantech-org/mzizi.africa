"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { DataTable } from "@mzizi/ui-web/components/data-table.tsx";
import { DetailList } from "@mzizi/ui-web/components/detail-list.tsx";
import { PageShell, Section } from "@mzizi/ui-web/components/page-shell.tsx";
import { getEvidence } from "@mzizi/api-client/actions/locality/get-evidence.actions.ts";
import { getEvidenceRequest } from "#/lib/api/locality/get-evidence.ts";

/** One citation with its source and files. */
type Record_ = Record<string, unknown>;

const scalars = [
  { key: "editionLabel", label: "Edition Label" },
  { key: "quotedText", label: "Quoted Text" },
  { key: "sourceCode", label: "Source Code" },
  { key: "sourceId", label: "Source Id" },
];

const lists = [
  {
    key: "files",
    label: "Files",
    columns: [
      { key: "fileVersionId", label: "File Version Id" },
      { key: "kind", label: "Kind" },
      { key: "mimeType", label: "Mime Type" },
      { key: "title", label: "Title" },
      { key: "url", label: "Url" },
    ],
  },
];

function EvidenceViewPageContent() {
  const address = useSearchParams();
  const citationId = address.get("citationId");
  const [record, setRecord] = useState<Record_ | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getEvidence(
      getEvidenceRequest({
        citationId: citationId ?? undefined,
      }) as never,
    ).then((response) => {
      if (!response.success) {
        setError(response.message);
        return;
      }
      setRecord(response.body as Record_ | null);
    });
  }, [citationId]);

  return (
    <PageShell title="Evidence View">
      {error === null ? null : <p role="alert">{error}</p>}
      {record === null ? null : (
        <>
          <Section>
            <DetailList
              entries={scalars.map((field) => ({
                label: field.label,
                value: record[field.key] == null ? null : String(record[field.key]),
              }))}
              missingText="Not recorded"
            />
          </Section>
          {lists.map((list) => (
            <Section key={list.key} title={list.label}>
              <DataTable
                columns={list.columns}
                rows={(record[list.key] as readonly Record_[] | undefined) ?? []}
                rowKey={(_row, index) => String(index)}
                cell={(row, key) => String(row[key] ?? "")}
                emptyText="None recorded."
              />
            </Section>
          ))}
        </>
      )}
    </PageShell>
  );
}

export default function EvidenceViewPage() {
  return (
    <Suspense>
      <EvidenceViewPageContent />
    </Suspense>
  );
}
