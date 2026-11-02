import type { Meta } from '@/lib/review/api';
import { ago, Badge, Empty, load, Notice, Pager, requireRole } from '../ui';

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await requireRole();
  const params = await searchParams;
  const { data, error } = await load<{ runs: Record<string, any>[]; meta: Meta }>('/pipeline/runs', { page: params.page });
  return (
    <>
      <h1>Runs</h1>
      <p className="sub">Each run is one import or extraction pass that staged candidates.</p>
      <Notice bad={error} />
      {data && data.runs.length === 0 ? <Empty>Nothing here yet.</Empty> : null}
      {data && data.runs.length > 0 ? (
        <>
          <div className="rv-table-wrap">
            <table>
              <thead><tr><th>Dataset</th><th>Mapping</th><th>Status</th><th>Candidates</th><th>Started</th></tr></thead>
              <tbody>
                {data.runs.map((r) => (
                  <tr key={r.id}><td>{r.dataset}</td><td>{r.mappingVersion}</td><td><Badge value={r.status} /></td><td>{r.candidates}</td><td>{ago(r.createdAt)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pager meta={data.meta} path="/review/runs" />
        </>
      ) : null}
    </>
  );
}
