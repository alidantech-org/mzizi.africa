import { readFileSync } from "node:fs";
import { join } from "node:path";
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
  /** The coding/research agent: an AI account that may assess, approve and promote, always recorded as itself. */
  { id: "00000000-0000-4000-8000-0000000000a3", subject: "mzizi-agent", role: "reviewer", issuer: "agent-mzizi" },
] as const;

export async function seedDevAccounts(db: DataSource, only?: string): Promise<string[]> {
  for (const account of DEV_ACCOUNTS.filter((a) => !only || a.subject === only)) {
    await db.query(
      `INSERT INTO identity.accounts (id, issuer, subject, status, created_at, updated_at, version) VALUES ($1, $3, $2, 'active', now(), now(), 1) ON CONFLICT (id) DO NOTHING`,
      [account.id, account.subject, "issuer" in account ? account.issuer : "mzizi-dev"],
    );
    const [existing] = await db.query(`SELECT 1 AS ok FROM identity.grants WHERE account_id = $1 AND role = $2`, [account.id, account.role]);
    if (!existing) await db.query(`INSERT INTO identity.grants (account_id, role, is_current, created_at, updated_at, version) VALUES ($1, $2, true, now(), now(), 1)`, [account.id, account.role]);
  }
  return DEV_ACCOUNTS.filter((a) => !only || a.subject === only).map((account) => account.subject);
}

interface StructureRow {
  code: string;
  name: string;
  abbreviation: string | null;
  type: string;
  branch: string;
  parent: string | null;
  legalBasis: string | null;
  confidence: string;
  relationship: string | null;
}

/**
 * Seeds Kenya's governance structure (arms of government, ministries, constitutional commissions, independent offices,
 * state corporations and regulators) from `fixtures/seed/ke-governance-structure.json`, which is custom-prepared from
 * manual research and says so in its `_meta`. Also creates one county government and one county assembly per county unit
 * already in the geography schema. Idempotent: an institution that exists by code is left alone.
 */
export async function seedGovernanceStructure(db: DataSource, jurisdictionCode = "ke"): Promise<{ institutions: number; relationships: number; counties: number }> {
  const file = JSON.parse(readFileSync(join(import.meta.dir, "..", "fixtures", "seed", "ke-governance-structure.json"), "utf8")) as { _meta: { label: string; caveat: string }; institutions: StructureRow[] };
  const [jurisdiction] = await db.query(`SELECT id FROM reference.jurisdictions WHERE code = $1`, [jurisdictionCode]);
  if (!jurisdiction) throw new Error(`jurisdiction ${jurisdictionCode} is not seeded`);
  const ensureClass = async (scheme: string, name: string): Promise<string> => {
    const code = `${scheme}/${name}`;
    const [found] = await db.query(`SELECT id FROM reference.classifications WHERE code = $1 AND jurisdiction_id = $2`, [code, jurisdiction.id]);
    if (found) return found.id;
    const [row] = await db.query(`INSERT INTO reference.classifications (code, scheme, label, jurisdiction_id, "order", is_current, created_at, updated_at, version) VALUES ($1, $2, $3, $4, 0, true, now(), now(), 1) RETURNING id`, [code, scheme, name.replaceAll("-", " "), jurisdiction.id]);
    return row.id;
  };
  const note = (row: StructureRow) => [row.abbreviation && `Abbreviation: ${row.abbreviation}.`, row.legalBasis && `Legal basis: ${row.legalBasis}.`, `${file._meta.label}; confidence ${row.confidence}.`].filter(Boolean).join(" ");
  let institutions = 0;
  const ids = new Map<string, string>();
  for (const row of file.institutions) {
    const [existing] = await db.query(`SELECT id FROM governance.institutions WHERE code = $1 AND jurisdiction_id = $2 AND is_current`, [row.code, jurisdiction.id]);
    if (existing) {
      ids.set(row.code, existing.id);
      continue;
    }
    const typeId = await ensureClass("governance/institution-type", row.type);
    const branchId = await ensureClass("governance/branch", row.branch);
    const [created] = await db.query(
      `INSERT INTO governance.institutions (code, name, type_id, branch_id, jurisdiction_id, description, is_current, created_at, updated_at, version) VALUES ($1, $2, $3, $4, $5, $6, true, now(), now(), 1) RETURNING id`,
      [row.code, row.name, typeId, branchId, jurisdiction.id, note(row)],
    );
    ids.set(row.code, created.id);
    institutions++;
  }
  let relationships = 0;
  for (const row of file.institutions) {
    if (!row.parent || !ids.has(row.parent) || !ids.has(row.code)) continue;
    const kind = row.relationship ?? "oversees";
    const [exists] = await db.query(`SELECT 1 AS ok FROM governance.relationships WHERE parent_institution_id = $1 AND child_institution_id = $2 AND kind = $3::governance.relationships_kind_enum AND is_current`, [ids.get(row.parent), ids.get(row.code), kind]);
    if (exists) continue;
    await db.query(`INSERT INTO governance.relationships (parent_institution_id, child_institution_id, kind, is_current, created_at, updated_at, version) VALUES ($1, $2, $3::governance.relationships_kind_enum, true, now(), now(), 1)`, [ids.get(row.parent), ids.get(row.code), kind]);
    relationships++;
  }
  let counties = 0;
  const countyType = await ensureClass("governance/institution-type", "county-government");
  const assemblyType = await ensureClass("governance/institution-type", "legislature");
  const executiveBranch = await ensureClass("governance/branch", "executive");
  const legislativeBranch = await ensureClass("governance/branch", "legislature");
  const units: { id: string; code: string; name: string }[] = await db.query(
    `SELECT u.id, u.code, u.name FROM geography.units u JOIN reference.classifications l ON l.id = u.level_id WHERE u.jurisdiction_id = $1 AND l.code = 'geography/level/county' AND u.is_current`, [jurisdiction.id],
  );
  for (const unit of units) {
    for (const [suffix, label, typeId, branchId] of [["government", "County Government of", countyType, executiveBranch], ["assembly", "County Assembly of", assemblyType, legislativeBranch]] as const) {
      const code = `${unit.code}/${suffix}`;
      const [exists] = await db.query(`SELECT 1 AS ok FROM governance.institutions WHERE code = $1 AND jurisdiction_id = $2 AND is_current`, [code, jurisdiction.id]);
      if (exists) continue;
      await db.query(
        `INSERT INTO governance.institutions (code, name, type_id, branch_id, jurisdiction_id, geo_unit_id, description, is_current, created_at, updated_at, version) VALUES ($1, $2, $3, $4, $5, $6, $7, true, now(), now(), 1)`,
        [code, `${label} ${unit.name}`, typeId, branchId, jurisdiction.id, unit.id, `Devolved ${suffix} of ${unit.name} county (Constitution of Kenya 2010, chapter 11). Generated from the county geography unit; ${file._meta.label}.`],
      );
      counties++;
    }
  }
  return { institutions, relationships, counties };
}

/**
 * Registers the sites of Kenyan government bodies from `fixtures/seed/ke-expected-sites.json` (custom-prepared from manual
 * research): one `expected` site per entry, linked to the institution it serves, with its candidate hostnames kept in an
 * `expected` reachability check (a domain row is only created once a probe confirms the host). No request is made.
 * Idempotent by site code.
 */
export async function seedExpectedSites(db: DataSource, jurisdictionCode = "ke"): Promise<{ sites: number; linked: number }> {
  const file = JSON.parse(readFileSync(join(import.meta.dir, "..", "fixtures", "seed", "ke-expected-sites.json"), "utf8")) as { _meta: { label: string }; sites: { code: string; institution: string; name: string; hosts: string[] }[] };
  const [jurisdiction] = await db.query(`SELECT id FROM reference.jurisdictions WHERE code = $1`, [jurisdictionCode]);
  if (!jurisdiction) throw new Error(`jurisdiction ${jurisdictionCode} is not seeded`);
  let sites = 0;
  let linked = 0;
  for (const entry of file.sites) {
    let [site] = await db.query(`SELECT id FROM website.sites WHERE code = $1`, [entry.code]);
    if (!site) {
      [site] = await db.query(
        `INSERT INTO website.sites (code, name, kind, status, jurisdiction_id, description, created_at, updated_at, version) VALUES ($1, $2, 'portal', 'expected', $3, $4, now(), now(), 1) RETURNING id`,
        [entry.code, entry.name, jurisdiction.id, `Expected site (${file._meta.label}); hostnames are unverified candidates: ${entry.hosts.join(", ")}.`],
      );
      await db.query(`INSERT INTO website.checks (site_id, kind, outcome, detail, checked_at, created_at, updated_at, version) VALUES ($1, 'reachability', 'degraded', $2, now(), now(), now(), 1)`, [site.id, JSON.stringify({ type: "expected", source: file._meta.label, candidates: entry.hosts })]);
      sites++;
    }
    const [institution] = await db.query(`SELECT id FROM governance.institutions WHERE code = $1 AND jurisdiction_id = $2 AND is_current`, [entry.institution, jurisdiction.id]);
    if (institution) {
      const [exists] = await db.query(`SELECT 1 AS ok FROM website.subjects WHERE site_id = $1 AND target_kind = 'governance.institutions' AND target_id = $2`, [site.id, institution.id]);
      if (!exists) {
        await db.query(`INSERT INTO website.subjects (site_id, target_kind, target_id, relation, created_at, updated_at, version) VALUES ($1, 'governance.institutions', $2, 'serves', now(), now(), 1)`, [site.id, institution.id]);
        linked++;
      }
    }
  }
  return { sites, linked };
}


/**
 * Registers the registry zones in use from `fixtures/seed/ke-domain-zones.json` (custom-prepared from manual research).
 * Idempotent by suffix; existing zones are left as they are. No request is made.
 */
export async function seedDomainZones(db: DataSource): Promise<{ zones: number }> {
  const file = JSON.parse(readFileSync(join(import.meta.dir, "..", "fixtures", "seed", "ke-domain-zones.json"), "utf8")) as { _meta: { label: string }; zones: { suffix: string; parentSuffix: string | null; operator: string; purpose: string; secondLevelOpen: boolean }[] };
  let zones = 0;
  for (const zone of file.zones) {
    const inserted = await db.query(
      `INSERT INTO website.domain_zones (suffix, parent_suffix, operator, purpose, second_level_open, source, created_at, updated_at, version) VALUES ($1, $2, $3, $4, $5, $6, now(), now(), 1) ON CONFLICT (suffix) DO NOTHING RETURNING id`,
      [zone.suffix, zone.parentSuffix, zone.operator, zone.purpose, zone.secondLevelOpen, file._meta.label],
    );
    if (inserted.length > 0) zones++;
  }
  return { zones };
}
