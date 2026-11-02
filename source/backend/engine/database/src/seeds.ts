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
  await loadFixtures(db, readFixture("reference/kenya-reference").rows, ids);
  await loadFixtures(db, readFixture("reference/poc-countries").rows, ids);
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
  for (const name of ["kenya", "south-africa"]) await loadFixtures(db, readFixture(name).rows, ids);
  await repairProvenanceKinds(db);
  return ids.size;
}

/**
 * Research seeds: registry rows collected by agents (sites and domains observed on a stated date).
 * They are facts about the registry, not claims about the world, and carry no legal approval.
 */
export async function seedResearch(db: DataSource): Promise<number> {
  const ids = new Map<string, string>();
  const [ke] = await db.query(`SELECT id FROM reference.jurisdictions WHERE code = 'ke'`);
  if (!ke) throw new Error("seed the reference data first (jurisdiction ke is missing)");
  ids.set("ke", ke.id);
  const before = ids.size;
  await loadFixtures(db, readFixture("research/ke-pilot-sites").rows, ids, { provenance: false });
  await loadFixtures(db, readFixture("research/ke-site-families").rows, ids, { provenance: false });
  for (const code of ["za", "ng", "tz"]) {
    const [row] = await db.query(`SELECT id FROM reference.jurisdictions WHERE code = $1`, [code]);
    if (row) ids.set(code, row.id);
  }
  await loadFixtures(db, readFixture("research/dossiers").rows, ids, { provenance: false });
  return ids.size - before;
}

/**
 * Illustrative site families and sites used by tests (worked examples). They are kept apart from the
 * default fixtures because their codes mirror the real research catalogue and must not collide with it.
 */
export async function seedSiteFixtures(db: DataSource, ids: Map<string, string>): Promise<void> {
  await loadFixtures(db, readFixture("kenya-sites").rows, ids);
  await repairProvenanceKinds(db);
}

/** Fixed ids so a local development sign-in (the admin site) can mint tokens for them. Never used outside local databases. */
export const DEV_ACCOUNTS = [
  { id: "00000000-0000-4000-8000-0000000000a1", subject: "dev-reviewer", role: "reviewer" },
  { id: "00000000-0000-4000-8000-0000000000a2", subject: "dev-admin", role: "admin" },
] as const;

export async function seedDevAccounts(db: DataSource): Promise<string[]> {
  for (const account of DEV_ACCOUNTS) {
    await db.query(
      `INSERT INTO identity.accounts (id, issuer, subject, status, created_at, updated_at, version) VALUES ($1, 'mzizi-dev', $2, 'active', now(), now(), 1) ON CONFLICT (id) DO NOTHING`,
      [account.id, account.subject],
    );
    const [existing] = await db.query(`SELECT 1 AS ok FROM identity.grants WHERE account_id = $1 AND role = $2`, [account.id, account.role]);
    if (!existing) await db.query(`INSERT INTO identity.grants (account_id, role, is_current, created_at, updated_at, version) VALUES ($1, $2, true, now(), now(), 1)`, [account.id, account.role]);
  }
  return DEV_ACCOUNTS.map((account) => account.subject);
}
