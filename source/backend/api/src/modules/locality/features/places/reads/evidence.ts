/**
 * Evidence reads: the citations that point at a record, with the artifact, edition and product behind each.
 * A citation names its subject by `subject_table` and `subject_id`; provenance is never a column on the record.
 */
import type { DataSource } from "typeorm";

import type { EvidenceDetail } from "#/modules/locality/schema/interface/evidence-detail.interface.ts";
import type { EvidenceRef } from "#/modules/locality/schema/interface/evidence-ref.interface.ts";
import type { MediaRef } from "#/modules/locality/schema/interface/media-ref.interface.ts";

interface EvidenceRow {
  subject_id: string;
  citation_id: string;
  source_name: string;
  publisher_name: string | null;
  artifact_title: string | null;
  locator: string | null;
  retrieved_at: Date | null;
  verification: string | null;
  confidence: number | null;
}

const EVIDENCE_SELECT = `
  select coalesce(rel.subject_id, c.subject_id) as subject_id, c.id as citation_id, p.title as source_name, pub.name as publisher_name,
    a.code as artifact_title, c.locator, c.recorded_at as retrieved_at,
    (select vf.outcome from source.verifications vf where vf.subject_table = 'source.citations' and vf.subject_id = c.id
      order by vf.assessed_at desc limit 1) as verification,
    (select vf.confidence from source.verifications vf where vf.subject_table = 'source.citations' and vf.subject_id = c.id
      order by vf.assessed_at desc limit 1) as confidence
  from source.citations c
  left join source.relationships rel on c.subject_table = 'source.relationships' and rel.id = c.subject_id
  join source.artifacts a on a.id = c.artifact_id
  join source.editions e on e.id = a.edition_id
  join source.products p on p.id = e.product_id
  left join source.publishers pub on pub.id = p.publisher_id`;

/** A locator is stored as JSON (`{"line": 12}` for a CSV line); a reader sees words. */
function readableLocator(stored: string | null): string | null {
  if (stored === null || !stored.startsWith("{")) return stored;
  try {
    const parsed = JSON.parse(stored) as { line?: number; page?: number };
    if (parsed.line !== undefined) return `Line ${parsed.line} of the source file`;
    if (parsed.page !== undefined) return `Page ${parsed.page}`;
  } catch {
    return stored;
  }
  return stored;
}

function toEvidence(row: EvidenceRow): EvidenceRef {
  return {
    citationId: row.citation_id,
    sourceName: row.source_name,
    publisherName: row.publisher_name,
    artifactTitle: row.artifact_title,
    locator: readableLocator(row.locator),
    retrievedAt: row.retrieved_at === null ? null : row.retrieved_at.toISOString(),
    verification: row.verification,
    confidence: row.confidence,
  };
}

/** The evidence of records of one table, grouped by record id. Records with no citation map to an empty list. */
export async function evidenceFor(
  db: DataSource,
  table: string,
  ids: readonly string[],
): Promise<Map<string, EvidenceRef[]>> {
  const grouped = new Map<string, EvidenceRef[]>(ids.map((id) => [id, []]));
  if (ids.length === 0) return grouped;
  const rows: EvidenceRow[] = await db.query(
    `${EVIDENCE_SELECT}
     where (c.subject_table = $1 and c.subject_id = any($2::uuid[])) or (rel.subject_table = $1 and rel.subject_id = any($2::uuid[]))
     order by c.recorded_at desc`,
    [table, ids],
  );
  for (const row of rows) grouped.get(row.subject_id)?.push(toEvidence(row));
  return grouped;
}

interface DetailRow extends EvidenceRow {
  source_id: string | null;
  source_code: string | null;
  edition_label: string | null;
}

/** One citation with its source, edition and the files its artifact is stored as; null when the citation is unknown. */
export async function evidenceDetail(
  db: DataSource,
  citationId: string,
): Promise<EvidenceDetail | null> {
  const rows: DetailRow[] = await db.query(
    `select base.*, cap.source_id, src.code as source_code, e.designation as edition_label
     from (${EVIDENCE_SELECT} where c.id = $1) base
     join source.citations c on c.id = base.citation_id
     join source.artifacts a on a.id = c.artifact_id
     join source.editions e on e.id = a.edition_id
     left join source.captures cap on cap.id = c.capture_id
     left join source.sources src on src.id = cap.source_id`,
    [citationId],
  );
  const row = rows[0];
  if (row === undefined) return null;
  const files: MediaRef[] = await db.query(
    `select fv.id as "fileVersionId", 'document' as kind, a.code as title, a.content_type as "mimeType", null as url
     from source.citations c join source.artifacts a on a.id = c.artifact_id
     join filesystem.file_versions fv on fv.id = a.file_version_id where c.id = $1`,
    [citationId],
  );
  return {
    evidence: toEvidence(row),
    sourceId: row.source_id,
    sourceCode: row.source_code,
    editionLabel: row.edition_label,
    quotedText: null,
    files,
  };
}
