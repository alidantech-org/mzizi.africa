import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { Client } from "pg";

import { openDataSource, withDatabase } from "../src/config.ts";
import { backfillGovernance } from "../src/governance-backfill.ts";
import { migrate } from "../src/migrations.ts";
import { seedFixtures, seedGovernanceStructure, seedReference } from "../src/seeds.ts";

/** Runs against a scratch database on the server in TEST_DATABASE_URL (skipped without it). */
const adminUrl = process.env.TEST_DATABASE_URL;
const scratch = process.env.TEST_GOVERNANCE_DB ?? "mzizi_test_governance";
const run = adminUrl ? describe : describe.skip;

run("governance generalisation", () => {
  let db: Awaited<ReturnType<typeof openDataSource>>;
  const meta = `created_at, updated_at, version, is_current`;
  const mv = `now(), now(), 1, true`;

  beforeAll(async () => {
    const admin = new Client({ connectionString: withDatabase(adminUrl as string, "postgres") });
    await admin.connect();
    await admin.query(`DROP DATABASE IF EXISTS ${scratch} WITH (FORCE)`);
    await admin.query(`CREATE DATABASE ${scratch}`);
    await admin.end();
    process.env.DATABASE_URL = withDatabase(adminUrl as string, scratch);
    await migrate();
    db = await openDataSource(process.env.DATABASE_URL);
    const ids = await seedReference(db);
    await seedFixtures(db, ids);
    await seedGovernanceStructure(db);
  }, 180_000);

  afterAll(async () => {
    await db?.destroy();
  });

  test("seeded institution relationships are subject and object pairs of kind institution", async () => {
    const rows = await db.query(`SELECT DISTINCT subject_kind, object_kind FROM governance.relationships`);
    expect(rows).toEqual([{ subject_kind: "institution", object_kind: "institution" }]);
  });

  test("a facility is linked to its operator and funder by relationships, and a unit hangs under an institution", async () => {
    const [inst] = await db.query(`SELECT id, jurisdiction_id FROM governance.institutions ORDER BY code LIMIT 1`);
    const [cls] = await db.query(`SELECT id FROM reference.classifications ORDER BY code LIMIT 1`);
    const [amenity] = await db.query(`INSERT INTO civic.amenities (code, name, jurisdiction_id, sector_id, is_active, ${meta}) VALUES ('test/hospital', 'Test hospital', $1, $2, true, ${mv}) RETURNING id`, [inst.jurisdiction_id, cls.id]);
    const [unit] = await db.query(`INSERT INTO governance.institutions (code, name, type_id, jurisdiction_id, ${meta}) VALUES ('test/unit', 'Test regional office', $1, $2, ${mv}) RETURNING id`, [cls.id, inst.jurisdiction_id]);
    for (const [kind, sk, sid, ok, oid] of [["operated_by", "amenity", amenity.id, "institution", inst.id], ["funded_by", "amenity", amenity.id, "institution", inst.id], ["has_component", "institution", inst.id, "institution", unit.id]]) {
      await db.query(`INSERT INTO governance.relationships (subject_kind, subject_id, object_kind, object_id, kind, ${meta}) VALUES ($1, $2, $3, $4, $5::governance.relationships_kind_enum, ${mv})`, [sk, sid, ok, oid, kind]);
    }
    const found = await db.query(`SELECT kind::text FROM governance.relationships WHERE subject_kind = 'amenity' AND subject_id = $1 ORDER BY kind`, [amenity.id]);
    expect(found.map((r: { kind: string }) => r.kind)).toEqual(["funded_by", "operated_by"]);
  });

  test("backfill scopes an office by its code, links an institution only on a single exact name match, and reports the rest", async () => {
    const [inst] = await db.query(`SELECT id, jurisdiction_id FROM governance.institutions ORDER BY code LIMIT 1`);
    const [other] = await db.query(`SELECT id, name FROM governance.institutions ORDER BY code OFFSET 1 LIMIT 1`);
    const [type] = await db.query(`SELECT id FROM reference.classifications WHERE scheme = 'organization/entity-type' LIMIT 1`);
    const insertOffice = (code: string) => db.query(`INSERT INTO governance.offices (code, name, institution_id, is_singleton, ${meta}) VALUES ($1, $1, $2, true, ${mv})`, [code, inst.id]);
    await insertOffice("ke/senate/nairobi");
    await insertOffice("ke/senate/atlantis");
    await insertOffice("ke/senate/nominated/jane-doe");
    await db.query(`INSERT INTO organization.entities (code, official_name, entity_type_id, jurisdiction_id, status, ${meta}) VALUES ('ke/pe/1', upper($1), $2, $3, 'active', ${mv})`, [other.name, type.id, inst.jurisdiction_id]);
    await db.query(`INSERT INTO organization.entities (code, official_name, entity_type_id, jurisdiction_id, status, ${meta}) VALUES ('ke/supplier/1', $1, $2, $3, 'active', ${mv})`, [inst.id.slice(0, 8), type.id, inst.jurisdiction_id]);
    const report = await backfillGovernance(db);
    expect(report.officesScoped).toBe(1);
    expect(report.officesUnmatched).toEqual(["ke/senate/atlantis"]);
    expect(report.institutionsLinked).toBe(1);
    // National bodies point at the root unit, a nominated seat inherits it, and an unmatched geographic seat stays a reported gap.
    const [{ n: nullInstitutions }] = await db.query(`SELECT count(*)::int AS n FROM governance.institutions i WHERE scope_geo_unit_id IS NULL AND NOT EXISTS (SELECT 1 FROM geography.units u WHERE u.jurisdiction_id = i.jurisdiction_id AND u.parent_id IS NULL)`);
    expect(nullInstitutions).toBe(0);
    const [nominated] = await db.query(`SELECT u.code FROM governance.offices o JOIN geography.units u ON u.id = o.scope_geo_unit_id WHERE o.code = 'ke/senate/nominated/jane-doe'`);
    expect(nominated.code).toBe("ke");
    expect(report.officesRootScoped).toBeGreaterThanOrEqual(1);
    expect(report.scopeGaps).toBeGreaterThanOrEqual(1);
    const [atlantis] = await db.query(`SELECT scope_geo_unit_id FROM governance.offices WHERE code = 'ke/senate/atlantis'`);
    expect(atlantis.scope_geo_unit_id).toBeNull();
    const [scoped] = await db.query(`SELECT u.code FROM governance.offices o JOIN geography.units u ON u.id = o.scope_geo_unit_id WHERE o.code = 'ke/senate/nairobi'`);
    expect(scoped.code).toBe("ke/nairobi");
    const [linked] = await db.query(`SELECT e.code FROM governance.institutions i JOIN organization.entities e ON e.id = i.entity_id WHERE i.id = $1`, [other.id]);
    expect(linked.code).toBe("ke/pe/1");
    expect((await backfillGovernance(db)).officesScoped).toBe(0);
  });
});
