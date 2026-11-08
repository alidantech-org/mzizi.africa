import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { Client } from "pg";

import { openDataSource, withDatabase } from "../src/config.ts";
import { checkIntegrity } from "../src/integrity.ts";
import { migrate } from "../src/migrations.ts";
import { backfillScope, editDistance, normalise, resolveName, type Unit } from "../src/scope.ts";
import { rootUnitId, seedFixtures, seedReference } from "../src/seeds.ts";

describe("scope name rules", () => {
  const unit = (code: string, name: string, level: string): Unit => ({ id: code, code, name, level, parentId: null });
  const units = [unit("ke/bomet/buret", "Buret", "constituency"), unit("ke/nairobi/dagoretti", "Dagoretti", "constituency"), unit("ke/kitui", "Kitui", "county"), unit("ke/meru/cental-imenti", "Cental Imenti", "constituency")];
  test("normalise drops generic words and punctuation", () => {
    expect(normalise("NG-CDF committee: Bureti constituency")).toBe("bureti");
    expect(normalise("Chuka/Igambang'Ombe")).toBe("chuka igambangombe");
  });
  test("edit distance", () => expect(editDistance("bureti", "buret")).toBe(1));
  test("a one-letter variant resolves, a different name does not", () => {
    expect(resolveName("bureti", units, "constituency")?.code).toBe("ke/bomet/buret");
    expect(resolveName("central-imenti", units, "constituency")?.code).toBe("ke/meru/cental-imenti");
    expect(resolveName("dagoretti-north", units, "constituency")).toBeUndefined();
    expect(resolveName("bureti", units, "county")).toBeUndefined();
  });
});

const adminUrl = process.env.TEST_DATABASE_URL;
const scratch = process.env.TEST_SCRATCH_DB ?? "mzizi_test_h3";
const run = adminUrl ? describe : describe.skip;

run("jurisdiction-wide scope", () => {
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
    await seedFixtures(db, await seedReference(db));
  }, 180_000);

  afterAll(async () => {
    await db?.destroy();
  });

  test("the root unit lookup returns the country unit and fails loudly for a jurisdiction without one", async () => {
    const [ke] = await db.query(`SELECT id FROM reference.jurisdictions WHERE code = 'ke'`);
    const root = await rootUnitId(db, ke.id);
    const [row] = await db.query(`SELECT code FROM geography.units WHERE id = $1`, [root]);
    expect(row.code).toBe("ke");
    await expect(rootUnitId(db, "00000000-0000-4000-8000-000000000000")).rejects.toThrow(/exactly one root/);
  });

  test("backfill scopes seats by variant spelling, national finance units and datasets, and reports the rest; the integrity rule sees gaps until then", async () => {
    const [ke] = await db.query(`SELECT id FROM reference.jurisdictions WHERE code = 'ke'`);
    const [type] = await db.query(`SELECT id FROM reference.classifications WHERE scheme = 'organization/entity-type' LIMIT 1`);
    const [inst] = await db.query(`INSERT INTO governance.institutions (code, name, type_id, jurisdiction_id, ${meta}) VALUES ('test/scope-inst', 'Scope test', $1, $2, ${mv}) RETURNING id`, [type.id, ke.id]);
    const [county] = await db.query(`SELECT u.id FROM geography.units u JOIN reference.classifications l ON l.id = u.level_id WHERE l.label = 'county' AND u.is_current ORDER BY u.code LIMIT 1`);
    await db.query(`INSERT INTO governance.offices (code, name, institution_id, is_singleton, ${meta}) VALUES ('ke/senate/atlantis', 'Senator, Atlantis', $1, true, ${mv})`, [inst.id]);
    const [level] = await db.query(`SELECT id FROM reference.classifications ORDER BY code LIMIT 1`);
    await db.query(`INSERT INTO finance.units (code, name, level_id, jurisdiction_id, ${meta}) VALUES ('ke/party-finance/test', 'Test party finance', $1, $2, ${mv})`, [level.id, ke.id]);
    await db.query(`INSERT INTO statistical.datasets (code, title, jurisdiction_id, ${meta}) VALUES ('test/dataset', 'Test dataset', $1, ${mv})`, [ke.id]);
    const before = await checkIntegrity(db);
    expect(before.map((issue) => issue.rule)).toEqual(expect.arrayContaining(["institutions of a jurisdiction with a root unit but no scope", "finance units of a jurisdiction with a root unit but no geography unit", "statistical datasets of a jurisdiction with a root unit but no geography unit"]));
    const report = await backfillScope(db);
    expect(report.financeUnitsRoot).toBe(1);
    expect(report.datasetsRoot).toBe(1);
    expect(report.officesLeft).toContain("ke/senate/atlantis");
    const [dataset] = await db.query(`SELECT u.code FROM statistical.datasets d JOIN geography.units u ON u.id = d.geo_unit_id WHERE d.code = 'test/dataset'`);
    expect(dataset.code).toBe("ke");
    expect((await backfillScope(db)).financeUnitsRoot).toBe(0);
    void county;
    const root = await rootUnitId(db, ke.id);
    await db.query(`UPDATE governance.institutions SET scope_geo_unit_id = $1 WHERE scope_geo_unit_id IS NULL`, [root]);
    await db.query(`UPDATE governance.offices SET scope_geo_unit_id = $1 WHERE scope_geo_unit_id IS NULL`, [root]);
    await db.query(`UPDATE finance.units SET geo_unit_id = $1 WHERE geo_unit_id IS NULL`, [root]);
    const after = (await checkIntegrity(db)).filter((issue) => /no scope|no geography unit/.test(issue.rule));
    expect(after).toEqual([]);
  });
});
