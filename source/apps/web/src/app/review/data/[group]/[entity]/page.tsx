import { notFound } from 'next/navigation';

import { DATA_CATALOG } from '@/lib/review/data-catalog';
import type { Meta } from '@/lib/review/api';
import { Empty, load, Notice, Pager, requireRole } from '../../../ui';

const SKIP = new Set(['createdAt', 'updatedAt', 'version']);
const text = (value: unknown) => (value === null || value === undefined ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value));

export default async function Page({ params, searchParams }: { params: Promise<{ group: string; entity: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  await requireRole();
  const { group, entity } = await params;
  if (!DATA_CATALOG[group]?.includes(entity)) notFound();
  const { page } = await searchParams;
  const { data, error } = await load<Record<string, unknown>>(`/${group}/${entity}`, { page });
  const rows = (Object.values(data ?? {}).find(Array.isArray) ?? []) as Record<string, unknown>[];
  const columns = [...new Set(rows.flatMap((row) => Object.keys(row)))].filter((key) => !SKIP.has(key)).slice(0, 8);
  const meta = data?.meta as Meta | undefined;
  return (
    <>
      <h1>{entity.replaceAll('-', ' ')}</h1>
      <p className="sub">{group.replaceAll('-', ' ')} · read-only</p>
      <Notice bad={error} />
      {data && rows.length === 0 ? <Empty>No records yet.</Empty> : null}
      {rows.length > 0 ? (
        <>
          <div className="rv-table-wrap">
            <table>
              <thead><tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr></thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={String(row.id ?? i)}>{columns.map((c) => <td key={c} className="mono">{text(row[c])}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
          {meta ? <Pager meta={meta} path={`/review/data/${group}/${entity}`} /> : null}
        </>
      ) : null}
    </>
  );
}
