import type { DataSource } from "typeorm";

import { loadFixtures, readFixture } from "../../../api/src/neutral/fixture-loader.ts";

/**
 * Seed classes (README): reference seeds are stable system vocabularies; fixtures are synthetic
 * test data and are never loaded outside _dev and _test databases (the CLI enforces it). Research
 * seeds arrive through the staging and promotion path, not from here.
 */
const PLACEHOLDER_KIND = "00000000-0000-4000-8000-000000000001";

export async function seedReference(db: DataSource): Promise<Map<string, string>> {
  const ids = await loadFixtures(db, readFixture("reference/media-formats").rows);
  await loadFixtures(db, readFixture("reference/site-tags").rows, ids);
  await loadFixtures(db, readFixture("reference/source-kinds").rows, ids);
  await repairProvenanceKinds(db);
  return ids;
}

/**
 * The fixture loader records provenance for the first rows it loads, before the source kinds exist,
 * so it uses a placeholder kind id. Once the kinds are seeded, point those rows at the real ones so
 * nothing refers to a classification that does not exist.
 */
export async function repairProvenanceKinds(db: DataSource): Promise<void> {
  const kind = async (scheme: string, code: string) => (await db.query(`SELECT id FROM reference.classifications WHERE scheme = $1 AND code = $2`, [scheme, `${scheme}/${code}`]))[0]?.id;
  const publisher = await kind("source/publisher-kind", "institution");
  const document = await kind("source/document-kind", "dataset");
  if (publisher) await db.query(`UPDATE source.publishers SET kind_id = $1 WHERE kind_id = $2`, [publisher, PLACEHOLDER_KIND]);
  if (document) await db.query(`UPDATE source.documents SET kind_id = $1 WHERE kind_id = $2`, [document, PLACEHOLDER_KIND]);
}

export async function seedFixtures(db: DataSource, ids: Map<string, string>): Promise<number> {
  for (const name of ["kenya", "kenya-sites", "south-africa"]) await loadFixtures(db, readFixture(name).rows, ids);
  await repairProvenanceKinds(db);
  return ids.size;
}
