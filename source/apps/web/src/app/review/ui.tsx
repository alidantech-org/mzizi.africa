import Link from 'next/link';
import { redirect } from 'next/navigation';

import { api, ApiError, type Meta } from '@/lib/review/api';
import { currentRole, type DevRole } from '@/lib/review/auth';

export async function requireRole(): Promise<DevRole> {
  const role = await currentRole();
  if (!role) redirect('/review/login');
  return role;
}

/** Loads data for a page; an API failure becomes a readable notice instead of a crash. */
export async function load<T>(path: string, query: Record<string, string | number | undefined> = {}): Promise<{ data?: T; error?: string }> {
  try {
    return { data: await api<T>(path, { query }) };
  } catch (error) {
    return { error: error instanceof ApiError ? error.message : 'Unexpected error while loading.' };
  }
}

export function Notice({ ok, bad }: { ok?: string; bad?: string }) {
  if (!ok && !bad) return null;
  return (
    <div className={`rv-notice ${bad ? 'bad' : 'ok'}`} role="status">
      {bad ?? ok}
    </div>
  );
}

const TONE: Record<string, string> = {
  pending: 'info', in_review: 'warn', approved: 'ok', promoted: 'ok', rejected: 'bad', invalid: 'bad', quarantined: 'bad', superseded: '', completed: 'ok', running: 'info', failed: 'bad', succeeded: 'ok',
  approved_with_conditions: 'ok', restricted: 'warn', not_reviewed: 'warn', expired: 'bad', error: 'bad', warning: 'warn', info: 'info',
};
export function Badge({ value }: { value: string }) {
  return <span className={`rv-badge ${TONE[value] ?? ''}`}>{value.replaceAll('_', ' ')}</span>;
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <div className="rv-empty">{children}</div>;
}

export function Pager({ meta, path, params }: { meta: Meta; path: string; params?: Record<string, string | undefined> }) {
  const href = (page: number) => {
    const q = new URLSearchParams(Object.entries(params ?? {}).filter(([, v]) => v) as [string, string][]);
    q.set('page', String(page));
    return `${path}?${q}`;
  };
  return (
    <div className="rv-pager">
      {meta.page > 1 ? <Link className="btn" href={href(meta.page - 1)}>Previous</Link> : null}
      <span>
        Page {meta.page} of {meta.totalPages} · {meta.total} total
      </span>
      {meta.page < meta.totalPages ? <Link className="btn" href={href(meta.page + 1)}>Next</Link> : null}
    </div>
  );
}

export function ago(value: string | null | undefined): string {
  return value ? new Date(value).toISOString().slice(0, 16).replace('T', ' ') : '';
}

export type Column = { label: string; field: string; kind?: 'badge' | 'time' | 'mono' };

/** One paged table over a reviewer list endpoint; the rows live under `key` in the response. */
export async function TablePage({ title, sub, path, rowsKey, columns, page, route }: { title: string; sub: string; path: string; rowsKey: string; columns: Column[]; page?: string; route: string }) {
  await requireRole();
  const { data, error } = await load<Record<string, any>>(path, { page });
  const rows: Record<string, any>[] = data?.[rowsKey] ?? [];
  return (
    <>
      <h1>{title}</h1>
      <p className="sub">{sub}</p>
      <Notice bad={error} />
      {data && rows.length === 0 ? <Empty>Nothing here yet.</Empty> : null}
      {rows.length > 0 ? (
        <>
          <div className="rv-table-wrap">
            <table>
              <thead><tr>{columns.map((c) => <th key={c.field}>{c.label}</th>)}</tr></thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.id ?? i}>
                    {columns.map((c) => {
                      const value = row[c.field];
                      if (value === null || value === undefined) return <td key={c.field} />;
                      if (c.kind === 'badge') return <td key={c.field}><Badge value={String(value)} /></td>;
                      if (c.kind === 'time') return <td key={c.field} className="nowrap">{ago(String(value))}</td>;
                      const text = typeof value === 'object' ? JSON.stringify(value) : String(value);
                      return <td key={c.field} className={c.kind === 'mono' ? 'mono' : undefined}>{text}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data?.meta ? <Pager meta={data.meta} path={route} /> : null}
        </>
      ) : null}
    </>
  );
}
