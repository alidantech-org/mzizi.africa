/** Fun facts for the country and, when a place is given, for it and the places above it: contents of the fun-fact category. */
import type { DataSource } from "typeorm";

import { crumbs, featureName, shortCode } from "./shared.ts";

export async function listFacts(db: DataSource, featureId: string | undefined, limit: number) {
  const chain = featureId ? await crumbs(db, featureId) : [];
  const ids = chain.map((c) => c.featureId);
  const rows: Record<string, unknown>[] = await db.query(
    `select c.code, c.title as statement, c.summary as detail,
       case when c.subject_table = 'geography.features' then ${featureName("c.subject_id", "'en'")} end as place,
       (c.subject_table = 'geography.features') as tagged
     from filesystem.contents c
     join reference.values cat on cat.id = c.category_id and cat.code = 'ref.val.fil.content.category.fun-fact'
     where c.deleted_at is null
       and (c.subject_table <> 'geography.features' or cardinality($1::uuid[]) = 0 or c.subject_id = any($1::uuid[]))
     order by (case when c.subject_table = 'geography.features' and c.subject_id = any($1::uuid[]) then 0 else 1 end), c.code limit $2`,
    [ids, Math.min(Math.max(limit, 1), 100)],
  );
  return {
    facts: rows.map((r) => ({ ...r, code: shortCode(String(r.code)) })),
    gaps:
      rows.length === 0
        ? ["No fun facts are recorded for this place yet. You can suggest one."]
        : [],
  };
}
