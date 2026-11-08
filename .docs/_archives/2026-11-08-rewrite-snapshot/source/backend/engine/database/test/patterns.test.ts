import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Client } from "pg";

import { openDataSource, withDatabase } from "../src/config.ts";
import { readJson } from "../src/curated.ts";
import { checkIntegrity } from "../src/integrity.ts";
import { migrate } from "../src/migrations.ts";
import { generateFromPatterns, patternFile, validatePatterns, type PatternFile } from "../src/patterns.ts";
import { seedFixtures, seedGovernanceStructure, seedReference } from "../src/seeds.ts";

describe("office pattern file", () => {
  const file = readJson<PatternFile>(patternFile);
  test("is valid and numbers all 47 counties from the First Schedule", () => {
    expect(validatePatterns(file)).toEqual([]);
    expect(Object.keys(file.countyNumbers)).toHaveLength(47);
    expect(file.countyNumbers.nairobi).toBe(47);
    expect(file.countyNumbers.mombasa).toBe(1);
  });
  test("county executive cardinality follows the law: one governor, one deputy, up to ten members", () => {
    const executive = file.patterns.find((p) => p.id === "county-executive")!;
    const by = Object.fromEntries(executive.offices!.map((o) => [o.definition, o]));
    expect([by.governor!.min, by.governor!.max]).toEqual([1, 1]);
    expect([by["deputy-governor"]!.min, by["deputy-governor"]!.max]).toEqual([1, 1]);
    expect(by["county-executive-committee-member"]!.max).toBe(10);
    expect(by["county-secretary"]!.max).toBe(1);
    const assembly = file.patterns.find((p) => p.id === "county-assembly")!;
    expect(assembly.offices!.find((o) => o.definition === "mca-marginalised-groups")!.max).toBe(6);
    expect(file.patterns.find((p) => p.id === "national-nominated-seats")!.offices!.map((o) => o.max)).toEqual([12, 16, 2, 2]);
  });
  test("validation rejects patterns that would collide or carry addresses", () => {
    const bad = structuredClone(file);
    bad.patterns[0]!.codeTemplate = "ke/county/{definition}";
    (bad.patterns[1]!.expectations[0] as unknown as Record<string, unknown>).address = "12 Harambee Avenue";
    const errors = validatePatterns(bad).join("\n");
    expect(errors).toMatch(/two units would share a code/);
    expect(errors).toMatch(/must not carry addresses/);
  });
});

const adminUrl = process.env.TEST_DATABASE_URL;
const scratch = `${process.env.TEST_SCRATCH_DB ?? "mzizi_test_h3"}_pat`;
const run = adminUrl ? describe : describe.skip;

run("pattern generation", () => {
  let db: Awaited<ReturnType<typeof openDataSource>>;
  const meta = `is_current, created_at, updated_at, version`;
  const mv = `true, now(), now(), 1`;
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
    const [{ id: j }] = await db.query(`SELECT id FROM reference.jurisdictions WHERE code = 'ke'`);
    const [{ id: root }] = await db.query(`SELECT id FROM geography.units WHERE code = 'ke'`);
    const level = async (name: string) => (await db.query(`SELECT id FROM reference.classifications WHERE code = $1 AND jurisdiction_id = $2`, [`geography/level/${name}`, j]))[0].id;
    const add = async (code: string, name: string, lvl: string, parent: string | null) => {
      const found = await db.query(`SELECT id FROM geography.units WHERE code = $1`, [code]);
      if (found[0]) return found[0].id as string;
      return (await db.query(`INSERT INTO geography.units (code, name, kind, level_id, parent_id, jurisdiction_id, is_active, ${meta}) VALUES ($1, $2, 'territorial', $3, $4, $5, true, ${mv}) RETURNING id`, [code, name, await level(lvl), parent, j]))[0].id as string;
    };
    const nairobi = await add("ke/nairobi", "Nairobi", "county", root);
    const mombasa = await add("ke/mombasa", "Mombasa", "county", root);
    const westlands = await add("ke/nairobi/kasarani", "Kasarani", "constituency", nairobi);
    await add("ke/nairobi/dagoretti", "Dagoretti", "constituency", nairobi);
    await add("ke/mombasa/nyali", "Nyali", "constituency", mombasa);
    await add("ke/nairobi/kasarani/clay-city", "Clay City", "ward", westlands);
    await add("ke/nairobi/kasarani/mwiki", "Mwiki", "ward", westlands);
    await seedGovernanceStructure(db);
    // An existing seat office scoped to Westlands with a holder; it must be adopted, not duplicated.
    const [na] = await db.query(`SELECT id FROM governance.institutions WHERE code = 'ke/national-assembly'`);
    const [office] = await db.query(`INSERT INTO governance.offices (code, name, institution_id, is_singleton, scope_geo_unit_id, ${meta}) VALUES ('ke/national-assembly/kasarani', 'Member of the National Assembly, Kasarani', $1, true, $2, ${mv}) RETURNING id`, [na.id, westlands]);
    const [person] = await db.query(`INSERT INTO person.individuals (code, display_name, life_status, ${meta}) VALUES ('test/person', 'Test Person', 'alive', ${mv}) RETURNING id`);
    await db.query(`INSERT INTO governance.holders (office_id, person_id, status, ${meta}) VALUES ($1, $2, 'substantive', ${mv})`, [office.id, person.id]);
  }, 240_000);
  afterAll(async () => {
    await db?.destroy();
  });

  test("generates scoped posts, adopts the existing seat and links its holder, checks totals, and is idempotent", async () => {
    const first = await generateFromPatterns(db);
    expect(first.officesAdopted).toBe(1);
    expect(first.holdersLinked["constituency-mp:constituency-mp"]).toBe(1);
    const mp = await db.query(`SELECT code FROM governance.offices WHERE definition_code = 'constituency-mp:constituency-mp' ORDER BY code`);
    expect(mp.map((r: { code: string }) => r.code)).toEqual(["ke/constituency/nairobi/dagoretti/constituency-mp", "ke/constituency/mombasa/nyali/constituency-mp", "ke/national-assembly/kasarani"].sort());
    const governor = await db.query(`SELECT o.code, u.code AS scope FROM governance.offices o JOIN geography.units u ON u.id = o.scope_geo_unit_id WHERE o.definition_code = 'county-executive:governor' ORDER BY o.code`);
    expect(governor).toEqual([{ code: "ke/county/001/governor", scope: "ke/mombasa" }, { code: "ke/county/047/governor", scope: "ke/nairobi" }]);
    const mca = await db.query(`SELECT o.code, i.code AS institution FROM governance.offices o JOIN governance.institutions i ON i.id = o.institution_id WHERE o.definition_code = 'ward-mca:mca' ORDER BY o.code`);
    expect(mca.map((r: { institution: string }) => r.institution)).toEqual(["ke/nairobi/assembly", "ke/nairobi/assembly", "ke/nairobi/assembly"]);
    const [cecm] = await db.query(`SELECT text_value FROM governance.rules r JOIN governance.offices o ON o.id = r.office_id WHERE o.code = 'ke/county/047/county-executive-committee-member' AND r.kind = 'other'`);
    expect(cecm.text_value).toMatch(/0 to 10/);
    // Units: IEBC offices exist per county and constituency, scoped, with an expected workplace and no address.
    const units = await db.query(`SELECT code FROM governance.institutions WHERE code LIKE 'ke/electoral-commission/%/%' AND code NOT LIKE '%commissioner%' ORDER BY code`);
    expect(units.length).toBe(5);
    const [exp] = await db.query(`SELECT e.status::text, e.subject_kind FROM place.expectations e JOIN governance.institutions i ON i.id = e.subject_id WHERE i.code = 'ke/electoral-commission/county/047'`);
    expect(exp).toEqual({ status: "expected", subject_kind: "governance.institutions" });
    // Totals: 2 counties exist here against the law's 47, 3 constituencies against 290, 3 wards against 1,450: reported, not hidden.
    expect(first.totals.find((t) => t.level === "county")).toMatchObject({ expected: 47, geography: 2, generated: 2, ok: false });
    expect(first.totals.find((t) => t.level === "constituency")).toMatchObject({ geography: 3, generated: 3 });
    expect((await checkIntegrity(db)).filter((issue) => /expectation|occupan|place/.test(issue.rule))).toEqual([]);
    const second = await generateFromPatterns(db);
    expect(second).toMatchObject({ officesCreated: 0, officesAdopted: 0, unitsCreated: 0, expectationsCreated: 0, rulesCreated: 0 });
  }, 240_000);

  test("a new pattern version keeps justified rows, changes a rule without deleting the old one, and retires rows no longer justified", async () => {
    const file = readJson<PatternFile>(patternFile);
    const changed = structuredClone(file);
    const executive = changed.patterns.find((p) => p.id === "county-executive")!;
    executive.version = 2;
    executive.offices = executive.offices!.filter((o) => o.definition !== "county-chief-officer");
    executive.offices!.find((o) => o.definition === "county-executive-committee-member")!.max = 12;
    const dir = mkdtempSync(join(tmpdir(), "patterns-"));
    const path = join(dir, "patterns.json");
    writeFileSync(path, JSON.stringify(changed));
    const [{ n: before }] = await db.query(`SELECT count(*)::int AS n FROM governance.offices`);
    const report = await generateFromPatterns(db, "ke", path, "2026-11-04");
    expect(report.retired.offices).toBe(2); // the chief-officer post of both counties
    expect(report.rulesCreated).toBe(2); // the changed ceiling in both counties
    const [{ n: after }] = await db.query(`SELECT count(*)::int AS n FROM governance.offices`);
    expect(after).toBe(before); // nothing was deleted
    const [retired] = await db.query(`SELECT is_current, valid_to::text AS valid_to FROM governance.offices WHERE code = 'ke/county/047/county-chief-officer'`);
    expect(retired).toEqual({ is_current: false, valid_to: "2026-11-04" });
    const rules = await db.query(`SELECT r.is_current, r.text_value FROM governance.rules r JOIN governance.offices o ON o.id = r.office_id WHERE o.code = 'ke/county/047/county-executive-committee-member' AND r.kind = 'other' ORDER BY r.created_at, r.id`);
    expect(rules).toHaveLength(2);
    expect(rules.map((r: { is_current: boolean }) => r.is_current)).toEqual([false, true]);
    expect(rules[1].text_value).toMatch(/0 to 12/);
    const [governor] = await db.query(`SELECT is_current FROM governance.offices WHERE code = 'ke/county/047/governor'`);
    expect(governor.is_current).toBe(true);
    const docs = await db.query(`SELECT title FROM source.documents WHERE title LIKE 'Office pattern county-executive version %' ORDER BY title`);
    expect(docs.map((d: { title: string }) => d.title)).toEqual(["Office pattern county-executive version 1", "Office pattern county-executive version 2"]);
  }, 240_000);
});
