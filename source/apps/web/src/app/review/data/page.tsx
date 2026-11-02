import Link from 'next/link';

import { DATA_CATALOG } from '@/lib/review/data-catalog';
import { requireRole } from '../ui';

export default async function Page() {
  await requireRole();
  return (
    <>
      <h1>Canonical data</h1>
      <p className="sub">Read-only view of the reviewed records, one list per entity. Changes only arrive through staging, review and promotion.</p>
      <div className="rv-grid">
        {Object.entries(DATA_CATALOG).map(([group, entities]) => (
          <div className="rv-card" key={group}>
            <h2>{group.replaceAll('-', ' ')}</h2>
            <div className="rv-filters">
              {entities.map((entity) => (
                <Link key={entity} href={`/review/data/${group}/${entity}`}>{entity.replaceAll('-', ' ')}</Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
