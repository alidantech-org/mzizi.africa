import { TablePage } from '../ui';

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  return (
    <TablePage
      route="/review/documents"
      path="/pipeline/documents"
      rowsKey="documents"
      page={(await searchParams).page}
      title="Documents"
      sub="Source documents the evidence points at. Raw artifacts are never overwritten; each retrieval is a capture."
      columns={[
        { label: 'Title', field: 'title' },
        { label: 'Publisher', field: 'publisher' },
        { label: 'Kind', field: 'kind' },
        { label: 'Language', field: 'language' },
        { label: 'Published', field: 'publishedOn' },
        { label: 'Captures', field: 'captures' },
        { label: 'URL', field: 'url', kind: 'mono' },
      ]}
    />
  );
}
