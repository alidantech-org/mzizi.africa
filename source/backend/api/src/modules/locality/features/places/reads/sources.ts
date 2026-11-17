/** Source reads: the published products (datasets and legal texts) behind the platform, with their evidence counts. */
import type { DataSource } from "typeorm";

import type { SourceEntry } from "#/modules/locality/schema/interface/source-entry.interface.ts";

interface SourceRow {
  source_id: string;
  code: string;
  name: string;
  publisher_name: string | null;
  artifact_count: string;
  citation_count: string;
}

export async function browseSources(
  db: DataSource,
  query: string | undefined,
  limit: number,
): Promise<SourceEntry[]> {
  const rows: SourceRow[] = await db.query(
    `select p.id as source_id, p.code, p.title as name, pub.name as publisher_name,
       count(distinct a.id)::text as artifact_count, count(c.id)::text as citation_count
     from source.products p
     left join source.publishers pub on pub.id = p.publisher_id
     left join source.editions e on e.id is not null and e.product_id = p.id
     left join source.artifacts a on a.edition_id = e.id
     left join source.citations c on c.artifact_id = a.id
     where ($1::text is null or p.title ilike '%' || $1 || '%' or p.code ilike '%' || $1 || '%')
     group by p.id, pub.name
     order by count(c.id) desc, p.title
     limit $2`,
    [query ?? null, Math.min(Math.max(limit, 1), 200)],
  );
  return rows.map((row) => ({
    sourceId: row.source_id,
    code: row.code,
    name: row.name,
    publisherName: row.publisher_name,
    artifactCount: Number(row.artifact_count),
    citationCount: Number(row.citation_count),
  }));
}
