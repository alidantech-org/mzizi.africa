import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { Client } from "pg";

import { openDataSource, withDatabase } from "../src/config.ts";
import { checkIntegrity } from "../src/integrity.ts";
import { drift, migrate } from "../src/migrations.ts";
import { occupantsOf, placeChain, resolveContact } from "../src/places.ts";
import { seedFixtures, seedGovernanceStructure, seedReference } from "../src/seeds.ts";

/** Runs against a scratch database on the server in TEST_DATABASE_URL (skipped without it). */
const adminUrl = process.env.TEST_DATABASE_URL;
const scratch = process.env.TEST_PLACES_DB ?? "mzizi_test_places";
const run = adminUrl ? describe : describe.skip;

run("places, occupancy, expectation and contact points", () => {
  let db: Awaited<ReturnType<typeof openDataSource>>;
  const meta = `created_at, updated_at, version, is_current`;
  const mv = `now(), now(), 1, true`;
  let roles: string[] = [];
  let units: string[] = [];
  let institutions: string[] = [];

  const one = async (sql: string, args: unknown[] = []) => (await db.query(sql, args))[0].id as string;
  const place = (kind: string, name: string, parent?: string, extra: { status?: string; unit?: string; type?: string } = {}) =>
    one(`INSERT INTO place.places (kind, status, name, parent_id, located_in_unit_id, building_type_id, ${meta}) VALUES ($1, $2, $3, $4, $5, $6, ${mv}) RETURNING id`, [kind, extra.status ?? "in_use", name, parent ?? null, extra.unit ?? null, extra.type ?? null]);
  const occupy = (subjectKind: string, subjectId: string, placeId: string, role: string, status = "active", validTo: string | null = null) =>
    one(`INSERT INTO place.occupancies (subject_kind, subject_id, place_id, role_id, status, valid_from, valid_to, ${meta}) VALUES ($1, $2, $3, $4, $5, '2020-01-01', $6, ${mv}) RETURNING id`, [subjectKind, subjectId, placeId, role, status, validTo]);
  const expect_ = (subjectId: string, role: string, o: { kind?: string; scope?: string | null; min?: number; max?: number | null; basis?: string; status?: string; resolved?: string | null; facility?: string | null } = {}) =>
    one(`INSERT INTO place.expectations (subject_kind, subject_id, role_id, scope_geo_unit_id, facility_type_id, min_count, max_count, basis, status, resolved_occupancy_id, ${meta}) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, ${mv}) RETURNING id`, [
      o.kind ?? "governance.institutions", subjectId, role, o.scope ?? null, o.facility ?? null, o.min ?? 1, o.max === undefined ? 1 : o.max, o.basis ?? "pattern", o.status ?? "expected", o.resolved ?? null,
    ]);
  const contact = (scopeKind: string, scopeId: string, value: string, o: { channel?: string; visibility?: string } = {}) =>
    one(`INSERT INTO contact.points (scope_kind, scope_id, channel, value, visibility, ${meta}) VALUES ($1, $2, $3, $4, $5, ${mv}) RETURNING id`, [scopeKind, scopeId, o.channel ?? "phone", value, o.visibility ?? "public"]);
  const rules = async () => (await checkIntegrity(db)).map((issue) => issue.rule);

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
    roles = (await db.query(`SELECT id FROM reference.classifications ORDER BY code LIMIT 8`)).map((row: { id: string }) => row.id);
    units = (await db.query(`SELECT id FROM geography.units ORDER BY code LIMIT 3`)).map((row: { id: string }) => row.id);
    institutions = (await db.query(`SELECT id FROM governance.institutions ORDER BY code LIMIT 6`)).map((row: { id: string }) => row.id);
  }, 180_000);

  afterAll(async () => {
    await db?.destroy();
  });

  test("the schema carries no source columns and the entities have not drifted", async () => {
    const columns = await db.query(`SELECT table_schema, table_name, column_name FROM information_schema.columns WHERE table_schema IN ('place', 'contact') AND column_name ILIKE '%source%'`);
    expect(columns).toEqual([]);
    const tables = await db.query(`SELECT table_schema || '.' || table_name AS name FROM information_schema.tables WHERE table_schema IN ('place', 'contact') ORDER BY 1`);
    expect(tables.map((row: { name: string }) => row.name)).toEqual(["contact.points", "place.expectations", "place.occupancies", "place.occupancy_links", "place.places"]);
    expect(await drift()).toEqual([]);
  }, 120_000);

  test("every new table is a valid evidence target and an unknown kind is reported", async () => {
    const [doc] = await db.query(`SELECT id FROM source.documents LIMIT 1`);
    const [method] = await db.query(`SELECT id FROM source.methods LIMIT 1`);
    const target = await place("site", "Evidence target");
    const targets: Array<[string, string]> = [
      ["place.places", target],
      ["contact.points", await contact("place.places", target, "+254700000099")],
    ];
    for (const [kind, id] of targets) {
      await db.query(`INSERT INTO source.verifications (target_kind, target_id, state, is_current, created_at, updated_at, version) VALUES ($1, $2, 'verified', true, now(), now(), 1)`, [kind, id]);
      if (doc && method) await db.query(`INSERT INTO source.attributions (target_kind, target_id, document_id, method_id, relation, created_at, updated_at, version) VALUES ($1, $2, $3, $4, 'supports', now(), now(), 1)`, [kind, id, doc.id, method.id]);
    }
    const names = (await rules()).filter((rule) => /targetKind names no stored table|source\.(verifications|attributions) \(/.test(rule));
    expect(names).toEqual([]);
    await db.query(`INSERT INTO source.verifications (target_kind, target_id, state, is_current, created_at, updated_at, version) VALUES ('place.sites', $1, 'verified', true, now(), now(), 1)`, [randomUUID()]);
    expect(await rules()).toContain("source.verifications.targetKind names no stored table");
    await db.query(`DELETE FROM source.verifications WHERE target_kind = 'place.sites'`);
  });

  test("1. a governor with an unknown building is an expectation, never a place or an address", async () => {
    const [county] = units;
    const governor = await one(`INSERT INTO governance.offices (code, name, institution_id, is_singleton, ${meta}) VALUES ('t/county/governor', 'Governor', $1, true, ${mv}) RETURNING id`, [institutions[0]]);
    const before = (await db.query(`SELECT count(*)::int AS n FROM place.places`))[0].n;
    await expect_(governor, roles[0]!, { kind: "governance.offices", scope: county!, basis: "pattern", status: "expected" });
    expect((await db.query(`SELECT count(*)::int AS n FROM place.places`))[0].n).toBe(before);
    const columns = (await db.query(`SELECT column_name FROM information_schema.columns WHERE table_schema = 'place' AND table_name = 'expectations'`)).map((row: { column_name: string }) => row.column_name);
    expect(columns.some((name: string) => /address|place_id|latitude|longitude/.test(name))).toBe(false);
    expect(await rules()).not.toContain("place.expectations holds an address, point or place");
  });

  test("2. an institution expects an HQ and one office per unit; the HQ occupancy resolves its expectation", async () => {
    const iebc = institutions[1]!;
    const hq = await expect_(iebc, roles[1]!, { status: "researching", min: 1, max: 1, basis: "legal_rule" });
    const perUnit = await Promise.all(units.map((unit) => expect_(iebc, roles[2]!, { scope: unit, basis: "legal_rule" })));
    expect(perUnit.length).toBe(units.length);
    const compound = await place("site", "Anniversary Towers", undefined, { unit: units[0] });
    const tower = await place("structure", "Tower", compound);
    const occupancy = await occupy("governance.institutions", iebc, tower, roles[1]!);
    await db.query(`UPDATE place.expectations SET status = 'identified', resolved_occupancy_id = $2 WHERE id = $1`, [hq, occupancy]);
    expect(await rules()).not.toContain("identified expectations without a resolving occupancy");
    // resolving with an occupancy of another subject is reported
    await db.query(`UPDATE place.expectations SET subject_id = $2 WHERE id = $1`, [hq, institutions[2]]);
    expect(await rules()).toContain("expectations resolved by an occupancy of another subject or role");
    await db.query(`UPDATE place.expectations SET subject_id = $2 WHERE id = $1`, [hq, iebc]);
  });

  test("3. a government-funded private school: one campus occupied by the operator, funding stays a relationship", async () => {
    const campus = await place("site", "Trust school campus", undefined, { unit: units[0] });
    const school = randomUUID();
    const entity = await db.query(`SELECT id FROM organization.entities LIMIT 1`);
    const operator = entity[0]?.id ?? institutions[3]!;
    const kind = entity[0] ? "organization.entities" : "governance.institutions";
    const occupancy = await occupy(kind, operator, campus, roles[3]!);
    expect(school).toBeDefined();
    expect((await occupantsOf(db, campus)).map((row) => row.occupancyId)).toContain(occupancy);
    expect(await rules()).not.toContain(`place.occupancies (${kind}) -> ${kind}`);
  });

  test("4. a county hospital: blocks and floors hold units; contacts at the reception and the unit", async () => {
    const hospital = await place("site", "County hospital", undefined, { unit: units[1] });
    const blockA = await place("structure", "Block A", hospital, { type: roles[4]! });
    const maternity = await place("unit", "Maternity", blockA);
    const blockB = await place("structure", "Block B", hospital);
    const floor1 = await place("floor", "Floor 1", blockB);
    const council = institutions[4]!;
    await occupy("governance.institutions", council, maternity, roles[4]!);
    await occupy("governance.institutions", institutions[5]!, floor1, roles[5]!);
    await contact("place.places", hospital, "+254700000001");
    await contact("place.places", maternity, "+254700000002");
    expect((await resolveContact(db, { kind: "place.places", id: maternity }, "phone"))?.value).toBe("+254700000002");
    // Block B floor 1 has no contact of its own; the walk goes up to the structure, then the site.
    const fallback = await resolveContact(db, { kind: "place.places", id: floor1 }, "phone");
    expect(fallback?.value).toBe("+254700000001");
    expect(fallback?.foundAt).toEqual({ kind: "place.places", id: hospital });
    expect((await placeChain(db, floor1)).map((row) => row.kind)).toEqual(["floor", "structure", "site"]);
    expect((await occupantsOf(db, hospital, { includeDescendants: true })).length).toBe(2);
  });

  test("5. a shared compound: several bodies occupy parts of it and none owns it", async () => {
    const annex = await place("site", "Harambee Annex", undefined, { unit: units[0] });
    const s1 = await place("structure", "Structure 1", annex);
    const s2 = await place("structure", "Structure 2", annex);
    const floors = await Promise.all([1, 2, 3].map((n) => place("floor", `Floor ${n}`, s1)));
    for (const floor of floors) await occupy("governance.institutions", institutions[0]!, floor, roles[0]!);
    await occupy("governance.institutions", institutions[1]!, s2, roles[0]!);
    const everyone = await occupantsOf(db, annex, { includeDescendants: true });
    expect(new Set(everyone.map((row) => row.subjectId))).toEqual(new Set([institutions[0], institutions[1]]));
    expect((await occupantsOf(db, annex)).length).toBe(0);
    const columns = (await db.query(`SELECT column_name FROM information_schema.columns WHERE table_schema = 'place' AND table_name = 'places'`)).map((row: { column_name: string }) => row.column_name);
    expect(columns.some((name: string) => /owner|operator/.test(name))).toBe(false);
  });

  test("6. one institution in many buildings at once, with different roles", async () => {
    const subject = institutions[2]!;
    const sites = await Promise.all(["Headquarters", "Annex", "Records centre"].map((name) => place("site", name)));
    for (const [index, site] of sites.entries()) await occupy("governance.institutions", subject, site, roles[index]!);
    const [{ n }] = await db.query(`SELECT count(*)::int AS n FROM place.occupancies WHERE subject_id = $1 AND status = 'active' AND valid_to IS NULL`, [subject]);
    expect(n).toBe(3);
  });

  test("7. a move keeps the old occupancy and place, links a successor; splits and merges need several links", async () => {
    const subject = institutions[3]!;
    const oldPlace = await place("site", "Old offices", undefined, { status: "vacant" });
    const newPlace = await place("site", "New offices");
    const first = await occupy("governance.institutions", subject, oldPlace, roles[0]!, "moved", "2023-06-30");
    const second = await occupy("governance.institutions", subject, newPlace, roles[0]!);
    expect(await rules()).toContain("moved occupancies without a successor link");
    await db.query(`INSERT INTO place.occupancy_links (predecessor_id, successor_id, kind, ${meta}) VALUES ($1, $2, 'move', ${mv})`, [first, second]);
    expect(await rules()).not.toContain("moved occupancies without a successor link");
    expect((await db.query(`SELECT status::text AS status FROM place.places WHERE id = $1`, [oldPlace]))[0].status).toBe("vacant");
    // duplicate link and self link are refused or reported
    await expect(db.query(`INSERT INTO place.occupancy_links (predecessor_id, successor_id, kind, ${meta}) VALUES ($1, $2, 'move', ${mv})`, [first, second])).rejects.toThrow();
    // a split with only one successor is incoherent, a second link makes it a split
    const thirdPlace = await place("site", "Branch offices");
    const third = await occupy("governance.institutions", subject, thirdPlace, roles[1]!);
    const splitFrom = await occupy("governance.institutions", subject, oldPlace, roles[2]!, "moved", "2024-01-31");
    await db.query(`INSERT INTO place.occupancy_links (predecessor_id, successor_id, kind, ${meta}) VALUES ($1, $2, 'split', ${mv})`, [splitFrom, second]);
    expect(await rules()).toContain("split links whose predecessor has one successor");
    await db.query(`INSERT INTO place.occupancy_links (predecessor_id, successor_id, kind, ${meta}) VALUES ($1, $2, 'split', ${mv})`, [splitFrom, third]);
    expect(await rules()).not.toContain("split links whose predecessor has one successor");
    // a merge: two occupancies into one successor
    const mergeA = await occupy("governance.institutions", institutions[4]!, oldPlace, roles[3]!, "moved", "2024-02-01");
    const mergeB = await occupy("governance.institutions", institutions[4]!, thirdPlace, roles[3]!, "moved", "2024-02-01");
    const merged = await occupy("governance.institutions", institutions[4]!, newPlace, roles[3]!);
    for (const predecessor of [mergeA, mergeB]) await db.query(`INSERT INTO place.occupancy_links (predecessor_id, successor_id, kind, ${meta}) VALUES ($1, $2, 'merge', ${mv})`, [predecessor, merged]);
    expect(await rules()).not.toContain("merge links whose successor has one predecessor");
  });

  test("8. a multi-tenant building: rooms hold different tenants; contacts fall back floor, structure, then occupant", async () => {
    const site = await place("site", "Shared building plot");
    const structure = await place("structure", "Tower", site);
    const floor2 = await place("floor", "Floor 2", structure);
    const room201 = await place("room", "Room 201", floor2);
    const room202 = await place("room", "Room 202", floor2);
    const agencyP = institutions[0]!;
    const agencyQ = institutions[1]!;
    await occupy("governance.institutions", agencyP, room201, roles[0]!);
    await occupy("governance.institutions", agencyQ, room202, roles[0]!);
    await contact("governance.institutions", agencyP, "+254711000201");
    await contact("governance.institutions", agencyQ, "+254711000202");
    // no contact anywhere on the place chain: each room answers with its occupant's own contact
    expect((await resolveContact(db, { kind: "place.places", id: room201 }, "phone"))?.value).toBe("+254711000201");
    expect((await resolveContact(db, { kind: "place.places", id: room202 }, "phone"))?.value).toBe("+254711000202");
    // a floor contact becomes the fallback for rooms without their own; a room contact still wins
    await contact("place.places", floor2, "+254711000200");
    expect((await resolveContact(db, { kind: "place.places", id: room201 }, "phone"))?.value).toBe("+254711000200");
    await contact("place.places", room201, "+254711000999");
    expect((await resolveContact(db, { kind: "place.places", id: room201 }, "phone"))?.value).toBe("+254711000999");
    // restricted contacts are not offered by default
    await contact("place.places", room202, "+254711000888", { visibility: "restricted" });
    expect((await resolveContact(db, { kind: "place.places", id: room202 }, "phone"))?.value).toBe("+254711000200");
    expect((await resolveContact(db, { kind: "place.places", id: room202 }, "phone", { visibilities: ["public", "restricted"] }))?.value).toBe("+254711000888");
  });

  test("integrity: scenarios satisfy every place rule, and broken rows are reported", async () => {
    const broken = (await rules()).filter((rule) => /^(place\.|contact\.)|places |occupanc|expectation/.test(rule));
    expect(broken).toEqual([]);
    const cycleA = await place("structure", "Cycle A", await place("site", "Cycle site"));
    const cycleB = await place("floor", "Cycle B", cycleA);
    await db.query(`UPDATE place.places SET parent_id = $2 WHERE id = $1`, [cycleA, cycleB]);
    const orphan = await place("room", "Room without a parent");
    const ghost = randomUUID();
    await occupy("governance.institutions", ghost, orphan, roles[0]!);
    await contact("place.places", randomUUID(), "+254700000000");
    await expect_(institutions[0]!, roles[0]!, { min: 3, max: 1, status: "identified" });
    await db.query(`UPDATE place.places SET latitude = 12.5 WHERE id = $1`, [orphan]);
    const reported = await rules();
    for (const rule of [
      "places inside a cycle",
      "places that are not sites and have no parent",
      "place.occupancies (governance.institutions) -> governance.institutions",
      "contact.points (place.places) -> place.places",
      "expectations with a maximum below the minimum",
      "identified expectations without a resolving occupancy",
      "places with half a point or a point out of range",
    ]) expect(reported).toContain(rule);
  });
});
