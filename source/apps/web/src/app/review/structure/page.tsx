import { TablePage } from '../ui';

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  return (
    <TablePage
      route="/review/structure"
      path="/pipeline/structure-versions"
      rowsKey="structureVersions"
      page={(await searchParams).page}
      title="Structure versions"
      sub="Versioned descriptions of how a site is laid out, used by extraction. A new layout is a new version, never an edit."
      columns={[
        { label: 'Purpose', field: 'purpose' },
        { label: 'Version', field: 'number' },
        { label: 'Status', field: 'status', kind: 'badge' },
        { label: 'Current', field: 'isCurrent' },
        { label: 'Schema', field: 'schemaVersion' },
        { label: 'Notes', field: 'notes' },
        { label: 'Created', field: 'createdAt', kind: 'time' },
      ]}
    />
  );
}
