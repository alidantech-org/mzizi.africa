import type { DataSource } from "typeorm";

import { loadFixtures, readFixture } from "../../../api/src/neutral/fixture-loader.ts";

/**
 * Seed classes (README): reference seeds are stable system vocabularies; fixtures are synthetic
 * test data and are never loaded outside _dev and _test databases (the CLI enforces it). Research
 * seeds arrive through the staging and promotion path, not from here.
 */
export async function seedReference(db: DataSource): Promise<Map<string, string>> {
  const ids = await loadFixtures(db, readFixture("reference/media-formats").rows);
  await loadFixtures(db, readFixture("reference/site-tags").rows, ids);
  return loadFixtures(db, readFixture("reference/source-kinds").rows, ids);
}

export async function seedFixtures(db: DataSource, ids: Map<string, string>): Promise<number> {
  for (const name of ["kenya", "kenya-sites", "south-africa"]) await loadFixtures(db, readFixture(name).rows, ids);
  return ids.size;
}
