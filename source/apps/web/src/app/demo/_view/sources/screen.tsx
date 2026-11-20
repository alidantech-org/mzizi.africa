/** Sources: every record we hold, with real, demo and sample material clearly labelled. */
import { SourceList } from "#demo/_view/sources/components/sources-ui";
import { Panel } from "#demo/_components/ui/panel";
import { DemoTag, PageHeader, RealTag } from "#demo/_components/ui/primitives";
import type { ViewProps } from "#demo/_view/shared/types";

const demo = [
  "County statistics (literacy, water, electricity and others)",
  "Election results, parties and turnout",
  "County budgets, projects and tenders",
  "Parliamentary votes and supplier links",
  "Constituency and ward shapes (schematic cells, real names)",
];

export function Sources(_: ViewProps) {
  return (
    <>
      <PageHeader eyebrow="Sources" title="Where this data comes from">
        Real data is read from the project seed and fixtures by a build script. Open any record to see its details, view our copy,
        or go to the original.
      </PageHeader>
      <div className="mb-2">
        <RealTag>Records we hold</RealTag>
      </div>
      <SourceList />
      <Panel title="Placeholders" note="Not real" className="mt-6">
        <div className="mb-3">
          <DemoTag />
        </div>
        <ul className="list-inside list-disc space-y-2 text-sm text-muted">
          {demo.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
