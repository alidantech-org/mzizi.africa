import Link from 'next/link';

import type { Candidate, Meta } from '@/lib/review/api';
import { ago, Badge, Empty, load, Notice, Pager, requireRole } from './ui';

const STATUSES = ['in_review', 'invalid', 'pending', 'approved', 'rejected', 'quarantined', 'promoted'];

export default async function QueuePage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await requireRole();
  const params = await searchParams;
  const status = params.status ?? 'in_review';
  const { data, error } = await load<{ candidates: Candidate[]; meta: Meta }>('/pipeline/candidates', { status: status === 'all' ? undefined : status, targetKind: params.targetKind, page: params.page });
  return (
    <>
      <h1>Review queue</h1>
      <p className="sub">Staged candidates waiting for a human decision. Nothing here is canonical until a reviewer approves it and it is promoted.</p>
      <Notice bad={error} />
      <div className="rv-filters" role="group" aria-label="Filter by status">
        {[...STATUSES, 'all'].map((s) => (
          <Link key={s} href={`/review?status=${s}`} aria-current={s === status}>
            {s.replaceAll('_', ' ')}
          </Link>
        ))}
      </div>
      {data && data.candidates.length === 0 ? <Empty>No candidates with status “{status.replaceAll('_', ' ')}”.</Empty> : null}
      {data && data.candidates.length > 0 ? (
        <>
          <div className="rv-table-wrap">
            <table>
              <thead>
                <tr><th>Target</th><th>Status</th><th>Method</th><th>Confidence</th><th>Issues</th><th>Staged</th><th /></tr>
              </thead>
              <tbody>
                {data.candidates.map((c) => (
                  <tr key={c.id}>
                    <td className="mono">{c.targetKind}</td>
                    <td><Badge value={c.status} /></td>
                    <td>{c.method.replaceAll('_', ' ')}</td>
                    <td>{c.confidence === null ? 'n/a' : `${Math.round(c.confidence * 100)}%`}</td>
                    <td>{c.issueCount ? <Badge value="warning" /> : null} {c.issueCount}</td>
                    <td className="nowrap">{ago(c.createdAt)}</td>
                    <td><Link className="btn" href={`/review/candidates/${c.id}`}>Open</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pager meta={data.meta} path="/review" params={{ status: params.status }} />
        </>
      ) : null}
    </>
  );
}
