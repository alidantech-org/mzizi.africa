/** Did-you-know facts for the country and, when a place is given, for it and the places above it. */
import type { DataSource } from "typeorm";

import { crumbs, featureName, shortCode } from "./shared.ts";

export async function listFacts(db: DataSource, featureId: string | undefined, limit: number) {
  const chain = featureId ? await crumbs(db, featureId) : [];
  const ids = chain.map((c) => c.featureId);
  const rows: Record<string, unknown>[] = await db.query(
    `select f.code, f.statement, f.detail, (select t.label from reference.topics t where t.id = f.topic_id) as topic,
       (select ${featureName("fp.feature_id", "'en'")} from facts.fact_places fp where fp.fact_id = f.id limit 1) as place,
       exists (select 1 from facts.fact_places fp where fp.fact_id = f.id) as tagged,
       (select s.title from source.citations c join source.artifacts a on a.id = c.artifact_id join source.editions e on e.id = a.edition_id join source.products s on s.id = e.product_id where c.id = f.source_citation_id) as source
     from facts.facts f
     where cardinality($1::uuid[]) = 0 or not exists (select 1 from facts.fact_places fp where fp.fact_id = f.id)
        or exists (select 1 from facts.fact_places fp where fp.fact_id = f.id and fp.feature_id = any($1::uuid[]))
     order by (case when exists (select 1 from facts.fact_places fp where fp.fact_id = f.id and fp.feature_id = any($1::uuid[])) then 0 else 1 end), f.code limit $2`,
    [ids, Math.min(Math.max(limit, 1), 100)]);
  return {
    facts: rows.map((r) => ({ ...r, code: shortCode(String(r.code)) })),
    gaps: rows.length === 0 ? ["No fun facts are recorded for this place yet. You can suggest one."] : [],
  };
}
