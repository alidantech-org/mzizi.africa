import { TablePage } from '../ui';

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  return (
    <TablePage
      route="/review/checks"
      path="/pipeline/checks"
      rowsKey="checks"
      page={(await searchParams).page}
      title="Site checks"
      sub="Reachability, change and layout checks recorded for each site, newest first."
      columns={[
        { label: 'Checked', field: 'checkedAt', kind: 'time' },
        { label: 'Site', field: 'siteName' },
        { label: 'Kind', field: 'kind' },
        { label: 'Outcome', field: 'outcome', kind: 'badge' },
        { label: 'Detail', field: 'detail' },
      ]}
    />
  );
}
