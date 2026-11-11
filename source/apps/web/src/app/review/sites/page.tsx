import type { Meta } from '@/lib/review/api';

/** A registered site as listed by the review API. */
type Site = { id: string; name: string; primaryDomain?: string | null; kind: string; status: string };
import { ago, Badge, Empty, load, Notice, Pager, requireRole } from '../ui';

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await requireRole();
  const params = await searchParams;
  const { data, error } = await load<{ sites: Site[]; meta: Meta }>('/pipeline/sites', { page: params.page });
  return (
    <>
      <h1>Sites</h1>
      <p className="sub">
        The registry of sources the data engine knows. A site is only collected once its assessment is approved (by a person, an AI agent,
        or the trusted-domain rule) and its jurisdiction is at pilot.
      </p>
      <Notice bad={error} />
      {data && data.sites.length === 0 ? <Empty>Nothing here yet.</Empty> : null}
      {data && data.sites.length > 0 ? (
        <>
          <div className="rv-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Primary domain</th>
                  <th>Kind</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.sites.map((r) => (
                  <tr key={r.id}>
                    <td>{r.name}</td>
                    <td>{r.primaryDomain ?? ''}</td>
                    <td>{r.kind.replaceAll('_', ' ')}</td>
                    <td>
                      <Badge value={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pager meta={data.meta} path="/review/sites" />
        </>
      ) : null}
    </>
  );
}
