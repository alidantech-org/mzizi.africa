import type { Meta } from '@/lib/review/api';

/** A data engine job as listed by the review API. */
type Job = { id: string; kind: string; status: string; attempts: number; error?: string | null; createdAt: string };
import { ago, Badge, Empty, load, Notice, Pager, requireRole } from '../ui';

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await requireRole();
  const params = await searchParams;
  const { data, error } = await load<{ jobs: Job[]; meta: Meta }>('/pipeline/jobs', { page: params.page });
  return (
    <>
      <h1>Jobs</h1>
      <p className="sub">Data engine jobs: extraction and import work, with retries and errors.</p>
      <Notice bad={error} />
      {data && data.jobs.length === 0 ? <Empty>Nothing here yet.</Empty> : null}
      {data && data.jobs.length > 0 ? (
        <>
          <div className="rv-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Kind</th>
                  <th>Status</th>
                  <th>Attempts</th>
                  <th>Error</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {data.jobs.map((r) => (
                  <tr key={r.id}>
                    <td>{r.kind}</td>
                    <td>
                      <Badge value={r.status} />
                    </td>
                    <td>{r.attempts}</td>
                    <td>{r.error ?? ''}</td>
                    <td>{ago(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pager meta={data.meta} path="/review/jobs" />
        </>
      ) : null}
    </>
  );
}
