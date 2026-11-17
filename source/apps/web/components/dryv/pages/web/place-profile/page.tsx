"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { DataTable } from "@mzizi/ui-web/components/data-table.tsx";
import { DetailList } from "@mzizi/ui-web/components/detail-list.tsx";
import { PageShell, Section } from "@mzizi/ui-web/components/page-shell.tsx";
import { getLocality } from "@mzizi/api-client/actions/locality/get-locality.actions.ts";
import { getLocalityRequest } from "#/lib/api/locality/get-locality.ts";

/** Who serves a place: officials, procurement, media and the evidence for each claim. */
type Record_ = Record<string, unknown>;

const scalars = [
  { key: "languageRequested", label: "Language Requested" },
  { key: "languageServed", label: "Language Served" },
];

const lists = [
  {
    key: "chain",
    label: "Chain",
    columns: [
      { key: "code", label: "Code" },
      { key: "depth", label: "Depth" },
      { key: "featureId", label: "Feature Id" },
      { key: "kindCode", label: "Kind Code" },
      { key: "kindLabel", label: "Kind Label" },
      { key: "name", label: "Name" },
    ],
  },
  {
    key: "media",
    label: "Media",
    columns: [
      { key: "fileVersionId", label: "File Version Id" },
      { key: "kind", label: "Kind" },
      { key: "mimeType", label: "Mime Type" },
      { key: "title", label: "Title" },
      { key: "url", label: "Url" },
    ],
  },
  {
    key: "officials",
    label: "Officials",
    columns: [
      { key: "holderId", label: "Holder Id" },
      { key: "leftOfficeOn", label: "Left Office On" },
      { key: "officeCode", label: "Office Code" },
      { key: "officeTitle", label: "Office Title" },
      { key: "partyName", label: "Party Name" },
      { key: "personName", label: "Person Name" },
      { key: "tookOfficeOn", label: "Took Office On" },
      { key: "unitFeatureId", label: "Unit Feature Id" },
      { key: "unitName", label: "Unit Name" },
    ],
  },
];

function PlaceProfilePageContent() {
  const address = useSearchParams();
  const featureId = address.get("featureId");
  const [record, setRecord] = useState<Record_ | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getLocality(
      getLocalityRequest({
        featureId: featureId ?? undefined,
      }) as never,
    ).then((response) => {
      if (!response.success) {
        setError(response.message);
        return;
      }
      setRecord(response.body as Record_ | null);
    });
  }, [featureId]);

  return (
    <PageShell title="Place Profile">
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

export default function PlaceProfilePage() {
  return (
    <Suspense>
      <PlaceProfilePageContent />
    </Suspense>
  );
}
