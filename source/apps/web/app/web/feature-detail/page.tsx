"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { DataTable } from "@mzizi/ui-web/components/data-table.tsx";
import { DetailList } from "@mzizi/ui-web/components/detail-list.tsx";
import { PageShell, Section } from "@mzizi/ui-web/components/page-shell.tsx";
import { getFeature } from "@mzizi/api-client/actions/geography/get-feature.actions.ts";
import { getFeatureRequest } from "#/lib/api/geography/get-feature.ts";

/** One geographic feature with its names. */
type Record_ = Record<string, unknown>;

const scalars = [
  { key: "code", label: "Code" },
  { key: "featureId", label: "Feature Id" },
  { key: "featureTypeId", label: "Feature Type Id" },
  { key: "validFrom", label: "Valid From" },
  { key: "validUntil", label: "Valid Until" },
];

const lists = [
  {
    key: "names",
    label: "Names",
    columns: [
      { key: "languageId", label: "Language Id" },
      { key: "name", label: "Name" },
    ],
  },
];

function FeatureDetailPageContent() {
  const address = useSearchParams();
  const featureId = address.get("featureId");
  const [record, setRecord] = useState<Record_ | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getFeature(
      getFeatureRequest({
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
    <PageShell title="Feature Detail">
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

export default function FeatureDetailPage() {
  return (
    <Suspense>
      <FeatureDetailPageContent />
    </Suspense>
  );
}
