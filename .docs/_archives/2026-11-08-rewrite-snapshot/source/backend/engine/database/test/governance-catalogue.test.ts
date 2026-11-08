import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { Client } from "pg";

import { openDataSource, withDatabase } from "../src/config.ts";
import { catalogueFile, validateCatalogue, seedGovernanceCatalogue, type CatalogueFile } from "../src/governance-catalogue.ts";
import { readJson } from "../src/curated.ts";
import { checkIntegrity } from "../src/integrity.ts";
import { migrate } from "../src/migrations.ts";
import { seedFixtures, seedReference } from "../src/seeds.ts";

describe("governance catalogue file", () => {
  const file = readJson<CatalogueFile>(catalogueFile);
  test("is sound: scope on every institution, parents exist, cardinality ordered", () => {
    expect(validateCatalogue(file)).toEqual([]);
  });
  test("covers the bodies the research plan names", () => {
    const codes = new Set(file.institutions.map((row) => row.code));
    for (const code of ["ke/teachers-service-commission", "ke/ntsa", "ke/kenha", "ke/kura", "ke/kerra", "ke/kra", "ke/ethics-and-anti-corruption-commission", "ke/office-of-the-director-of-public-prosecutions", "ke/judiciary", "ke/electoral-commission", "ke/national-land-commission", "ke/commission-on-revenue-allocation", "ke/salaries-and-remuneration-commission", "ke/commission-on-administrative-justice", "ke/kenya-national-commission-on-human-rights", "ke/registrar-of-political-parties", "ke/office-of-the-controller-of-budget", "ke/office-of-the-auditor-general", "ke/national-police-service/directorate-of-criminal-investigations"]) expect(codes.has(code)).toBe(true);
    expect(file.institutions.filter((row) => row.type === "state-department").length).toBeGreaterThanOrEqual(40);
    expect(file.institutions.filter((row) => row.type === "ministry").length).toBeGreaterThanOrEqual(21);
  });
  test("validation rejects a missing scope, an unknown parent and a reversed cardinality", () => {
    const bad: CatalogueFile = { _meta: { label: "x" }, institutions: [
      { code: "a", name: "A", type: "t", branch: "b", parent: "zzz", confidence: "high", offices: [{ slug: "o", title: "O", min: 3, max: 1, appointingAuthority: "x", selection: "s", termYears: null, maxTerms: null, legalBasis: "y", singleton: false }] },
    ] };
    const errors = validateCatalogue(bad).join("\n");
    expect(errors).toMatch(/scope is required/);
    expect(errors).toMatch(/unknown parent/);
    expect(errors).toMatch(/max below min/);
  });
});

const adminUrl = process.env.TEST_DATABASE_URL;
const scratch = process.env.TEST_SCRATCH_DB ?? "mzizi_test_h3";
const run = adminUrl ? describe : describe.skip;

run("governance catalogue load", () => {
  let db: Awaited<ReturnType<typeof openDataSource>>;
  beforeAll(async () => {
    const admin = new Client({ connectionString: withDatabase(adminUrl as string, "postgres") });
    await admin.connect();
    await admin.query(`DROP DATABASE IF EXISTS ${scratch}_cat WITH (FORCE)`);
    await admin.query(`CREATE DATABASE ${scratch}_cat`);
    await admin.end();
    process.env.DATABASE_URL = withDatabase(adminUrl as string, `${scratch}_cat`);
    await migrate();
    db = await openDataSource(process.env.DATABASE_URL);
    await seedFixtures(db, await seedReference(db));
    const [{ id: jurisdiction }] = await db.query(`SELECT id FROM reference.jurisdictions WHERE code = 'ke'`);
    const [{ id: root }] = await db.query(`SELECT id FROM geography.units WHERE code = 'ke'`);
    const [{ id: level }] = await db.query(`SELECT id FROM reference.classifications WHERE code = 'geography/level/county' AND jurisdiction_id = $1`, [jurisdiction]);
    for (const name of ["nairobi", "mombasa", "uasin-gishu", "kisumu"]) {
      const existing = await db.query(`SELECT 1 FROM geography.units WHERE code = $1`, [`ke/${name}`]);
      if (existing.length === 0) await db.query(`INSERT INTO geography.units (code, name, kind, level_id, parent_id, jurisdiction_id, is_active, is_current, created_at, updated_at, version) VALUES ($1, $2, 'territorial', $3, $4, $5, true, true, now(), now(), 1)`, [`ke/${name}`, name, level, root, jurisdiction]);
    }
  }, 240_000);
  afterAll(async () => {
    await db?.destroy();
  });

  test("loads the catalogue, attributes it to a curated source document, and is idempotent", async () => {
    const first = await seedGovernanceCatalogue(db);
    expect(first.institutions).toBeGreaterThan(350);
    expect(first.officesCreated).toBeGreaterThan(600);
    expect(first.expectations).toBeGreaterThan(300);
    expect(first.facilities).toBe(17);
    const [{ n: unscoped }] = await db.query(`SELECT count(*)::int AS n FROM governance.institutions WHERE scope_geo_unit_id IS NULL AND code LIKE 'ke/%'`);
    expect(unscoped).toBe(0);
    const [{ n: officesUnscoped }] = await db.query(`SELECT count(*)::int AS n FROM governance.offices WHERE scope_geo_unit_id IS NULL AND code LIKE 'ke/%/%'`);
    expect(officesUnscoped).toBe(0);
    const [doc] = await db.query(`SELECT d.title, p.name FROM source.documents d JOIN source.publishers p ON p.id = d.publisher_id WHERE p.code = 'mzizi-curated'`);
    expect(doc.name).toBe("Mzizi curated research");
    const [{ n: attributed }] = await db.query(`SELECT count(*)::int AS n FROM source.attributions a JOIN source.documents d ON d.id = a.document_id WHERE d.title = $1`, [doc.title]);
    expect(attributed).toBeGreaterThan(1000);
    const [nunc] = await db.query(`SELECT o.name, o.is_singleton, (SELECT text_value FROM governance.rules r WHERE r.office_id = o.id AND r.kind = 'other') AS text FROM governance.offices o WHERE o.code = 'ke/office-of-the-director-of-public-prosecutions/director-of-public-prosecutions'`);
    expect(nunc.is_singleton).toBe(true);
    expect(nunc.text).toMatch(/art\. 157/);
    const [term] = await db.query(`SELECT r.numeric_value::int AS years FROM governance.rules r JOIN governance.offices o ON o.id = r.office_id WHERE o.code = 'ke/office-of-the-auditor-general/auditor-general' AND r.kind = 'term_length_years'`);
    expect(term.years).toBe(8);
    const [hq] = await db.query(`SELECT e.status::text, e.basis::text FROM place.expectations e JOIN governance.institutions i ON i.id = e.subject_id WHERE i.code = 'ke/ntsa' AND e.subject_kind = 'governance.institutions' LIMIT 1`);
    expect(hq.status).toBe("expected");
    // An expectation never holds an address (integrity), and the new rows break no rule.
    expect((await checkIntegrity(db)).filter((issue) => !/no scope|no geography unit/.test(issue.rule))).toEqual([]);
    const second = await seedGovernanceCatalogue(db);
    expect(second).toMatchObject({ officesCreated: 0, rules: 0, procedures: 0, expectations: 0, facilities: 0, attributions: 0, scopesSet: 0 });
  }, 240_000);
});
