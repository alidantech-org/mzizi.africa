import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import type { DataSource } from "typeorm";

/**
 * Shared plumbing for curated seeds and patterns. A seed or pattern file is a source document (publisher "Mzizi curated research",
 * kind curated seed) and every row it creates is attributed to it with method curated, so records never gain `source` columns
 * (DEC-PLACES-AND-OFFICE-PATTERNS). Everything is idempotent.
 */
export const CURATED_PUBLISHER_CODE = "mzizi-curated";
export const CURATED_PUBLISHER_NAME = "Mzizi curated research";
export const CONFIDENCE: Record<string, number> = { high: 0.85, medium: 0.6, low: 0.35 };

export const sha = (text: string): string => createHash("sha256").update(text).digest("hex").slice(0, 16);

export async function ensureClassification(db: DataSource, scheme: string, name: string, jurisdictionId: string): Promise<string> {
  const code = `${scheme}/${name}`;
  const [found] = await db.query(`SELECT id FROM reference.classifications WHERE code = $1 AND jurisdiction_id = $2`, [code, jurisdictionId]);
  if (found) return found.id;
  const [row] = await db.query(
    `INSERT INTO reference.classifications (code, scheme, label, jurisdiction_id, "order", is_current, created_at, updated_at, version) VALUES ($1, $2, $3, $4, 0, true, now(), now(), 1) RETURNING id`,
    [code, scheme, name.replaceAll("-", " "), jurisdictionId],
  );
  return row.id;
}

export async function curatedMethod(db: DataSource): Promise<string> {
  const [found] = await db.query(`SELECT id FROM source.methods WHERE kind = 'curated' AND tool = 'engine-database curated seed' LIMIT 1`);
  if (found) return found.id;
  const [row] = await db.query(`INSERT INTO source.methods (kind, name, tool, tool_version, created_at, updated_at, version) VALUES ('curated', 'curated seed or pattern', 'engine-database curated seed', '0.1.0', now(), now(), 1) RETURNING id`);
  return row.id;
}

/** Registers a seed or pattern file (by title, which carries its version) as a source document. Returns its id. */
export async function registerCuratedDocument(db: DataSource, jurisdictionId: string, title: string, citation: string): Promise<string> {
  let [publisher] = await db.query(`SELECT id FROM source.publishers WHERE code = $1`, [CURATED_PUBLISHER_CODE]);
  if (!publisher) {
    const kind = await ensureClassification(db, "source/publisher-kind", "repository", jurisdictionId);
    [publisher] = await db.query(`INSERT INTO source.publishers (code, name, kind_id, jurisdiction_id, created_at, updated_at, version) VALUES ($1, $2, $3, $4, now(), now(), 1) RETURNING id`, [CURATED_PUBLISHER_CODE, CURATED_PUBLISHER_NAME, kind, jurisdictionId]);
  }
  const [found] = await db.query(`SELECT id FROM source.documents WHERE publisher_id = $1 AND title = $2`, [publisher.id, title]);
  if (found) return found.id;
  const kind = await ensureClassification(db, "source/document-kind", "curated_seed", jurisdictionId);
  const [row] = await db.query(
    `INSERT INTO source.documents (publisher_id, title, kind_id, citation, licence, jurisdiction_id, created_at, updated_at, version) VALUES ($1, $2, $3, $4, 'Mzizi project work (no third-party licence)', $5, now(), now(), 1) RETURNING id`,
    [publisher.id, title, kind, citation.slice(0, 1000), jurisdictionId],
  );
  return row.id;
}

/** Attributes a row to a document once per (target, field, document, locator). Returns true when it wrote a row. */
export async function attribute(db: DataSource, methodId: string, documentId: string, targetKind: string, targetId: string, confidence: number, locator: string | null = null, field: string | null = null): Promise<boolean> {
  const [exists] = await db.query(
    `SELECT 1 AS ok FROM source.attributions WHERE document_id = $1 AND target_kind = $2 AND target_id = $3 AND target_field IS NOT DISTINCT FROM $4 AND locator IS NOT DISTINCT FROM $5`,
    [documentId, targetKind, targetId, field, locator],
  );
  if (exists) return false;
  await db.query(
    `INSERT INTO source.attributions (document_id, target_kind, target_id, target_field, relation, method_id, confidence, locator, created_at, updated_at, version) VALUES ($1, $2, $3, $4, 'derived_from', $5, $6, $7, now(), now(), 1)`,
    [documentId, targetKind, targetId, field, methodId, confidence, locator?.slice(0, 500) ?? null],
  );
  return true;
}

export function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}
