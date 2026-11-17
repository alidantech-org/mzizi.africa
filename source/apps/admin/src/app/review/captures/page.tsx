import { TablePage } from '../ui';

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  return (
    <TablePage
      route="/review/captures"
      path="/pipeline/captures"
      rowsKey="captures"
      page={(await searchParams).page}
      title="Captures"
      sub="Every retrieval of a document, with its time, status, tool and content hash, so a claim can be traced to what was actually fetched."
      columns={[
        { label: 'Retrieved', field: 'retrievedAt', kind: 'time' },
        { label: 'Document', field: 'documentTitle' },
        { label: 'Status', field: 'httpStatus' },
        { label: 'Tool', field: 'tool' },
        { label: 'Content hash', field: 'contentHash', kind: 'mono' },
        { label: 'URL', field: 'retrievedUrl', kind: 'mono' },
      ]}
    />
  );
}
