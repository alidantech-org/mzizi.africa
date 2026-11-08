import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { Client } from "pg";

import { openDataSource, withDatabase } from "../src/config.ts";
import { migrateLocations } from "../src/location-migration.ts";
import { migrate } from "../src/migrations.ts";
import { DropOrganizationLocations1794500000100 } from "../migrations/1794500000100-drop-organization-locations.ts";
import { seedFixtures, seedReference } from "../src/seeds.ts";

/** Runs against a scratch database on the server in TEST_DATABASE_URL (skipped without it). */
const adminUrl = process.env.TEST_DATABASE_URL;
const scratch = process.env.TEST_LOCATIONS_DB ?? "mzizi_test_locations";
const run = adminUrl ? describe : describe.skip;

run("organisation locations and contact identifiers move into the place model", () => {
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
    // Recreate the retired table so the data move can be exercised on the shape the real database had.
    const runner = db.createQueryRunner();
    await new DropOrganizationLocations1794500000100().down(runner);
    await runner.release();
    const ids = await seedReference(db);
    await seedFixtures(db, ids);
  }, 180_000);

  afterAll(async () => {
    await db?.destroy();
  });

  test("every location becomes a place with an occupancy, evidence follows, contacts become hidden contact points, and a second run does nothing", async () => {
    // The migration under test removes organization.locations in a later migration; this test runs while the table still exists.
    const [jur] = await db.query(`SELECT id FROM reference.jurisdictions WHERE code = 'ke'`);
    const [unit] = await db.query(`SELECT id FROM geography.units WHERE code = 'ke/nairobi'`);
    const [doc] = await db.query(`SELECT id FROM source.documents LIMIT 1`);
    const [method] = await db.query(`SELECT id FROM source.methods LIMIT 1`);
    const klass = async (code: string, scheme: string) => (await db.query(`INSERT INTO reference.classifications (code, scheme, label, jurisdiction_id, is_current, created_at, updated_at, version) VALUES ($1, $2, $4, $3, true, now(), now(), 1) ON CONFLICT DO NOTHING RETURNING id`, [code, scheme, jur.id, code]))[0]?.id ?? (await db.query(`SELECT id FROM reference.classifications WHERE code = $1 AND jurisdiction_id = $2`, [code, jur.id]))[0].id;
    const school = await klass("organization/entity-type/school", "organization/entity-type");
    const ministry = await klass("organization/entity-type/ministry", "organization/entity-type");
    const phone = await klass("organization/identifier-scheme/contact-phone", "organization/identifier-scheme");
    const email = await klass("organization/identifier-scheme/contact-email", "organization/identifier-scheme");
    const kra = await klass("organization/identifier-scheme/kra-pin", "organization/identifier-scheme");
    const entity = async (code: string, name: string, type: string) => (await db.query(`INSERT INTO organization.entities (code, official_name, entity_type_id, jurisdiction_id, status, ${meta}) VALUES ($1, $2, $3, $4, 'active', ${mv}) RETURNING id`, [code, name, type, jur.id]))[0].id as string;
    const e1 = await entity("t/1", "Test Primary School", school);
    const e2 = await entity("t/2", "Test Ministry", ministry);
    const loc = async (entityId: string, address: string, unitId: string | null) => (await db.query(`INSERT INTO organization.locations (entity_id, address_text, geo_unit_id, ${meta}) VALUES ($1, $2, $3, ${mv}) RETURNING id`, [entityId, address, unitId]))[0].id as string;
    const l1 = await loc(e1, "P.O. Box 1, Nairobi", unit.id);
    const l2 = await loc(e2, "Harambee Avenue", null);
    const ident = async (entityId: string, scheme: string, value: string) => (await db.query(`INSERT INTO organization.identifiers (entity_id, scheme_id, value, ${meta}) VALUES ($1, $2, $3, ${mv}) RETURNING id`, [entityId, scheme, value]))[0].id as string;
    const i1 = await ident(e1, phone, "+254700000001");
    const i2 = await ident(e1, email, "school@example.go.ke");
    const i3 = await ident(e1, kra, "P000000001A");
    for (const [kind, id] of [["organization.locations", l1], ["organization.locations", l2], ["organization.identifiers", i1]]) {
      await db.query(`INSERT INTO source.attributions (document_id, method_id, relation, target_kind, target_id, created_at, updated_at, version) VALUES ($1, $2, 'supports', $3, $4, now(), now(), 1)`, [doc.id, method.id, kind, id]);
      await db.query(`INSERT INTO source.verifications (target_kind, target_id, state, ${meta}) VALUES ($1, $2, 'verified', ${mv})`, [kind, id]);
    }

    const report = await migrateLocations(db);
    expect(report).toMatchObject({ locationsBefore: 2, places: 2, occupancies: 2, contactIdentifiersBefore: 2, contactPoints: 2, attributionsMovedToPlaces: 2, attributionsCopiedToOccupancies: 2, verificationsMovedToPlaces: 2, verificationsCopiedToOccupancies: 2, contactAttributionsMoved: 1, contactVerificationsMoved: 1 });

    const places = await db.query(`SELECT p.name, p.kind::text AS kind, p.address_text, u.code AS unit, r.code AS role FROM place.occupancies o JOIN place.places p ON p.id = o.place_id LEFT JOIN geography.units u ON u.id = p.located_in_unit_id JOIN reference.classifications r ON r.id = o.role_id WHERE o.subject_kind = 'organization.entities' ORDER BY p.name`);
    expect(places).toEqual([
      { name: "Test Ministry", kind: "site", address_text: "Harambee Avenue", unit: null, role: "place/occupancy-role/official-workplace" },
      { name: "Test Primary School", kind: "site", address_text: "P.O. Box 1, Nairobi", unit: "ke/nairobi", role: "place/occupancy-role/school-campus" },
    ]);
    const points = await db.query(`SELECT channel::text AS channel, value, visibility::text AS visibility, scope_kind FROM contact.points ORDER BY channel`);
    expect(points).toEqual([
      { channel: "email", value: "school@example.go.ke", visibility: "restricted", scope_kind: "organization.entities" },
      { channel: "phone", value: "+254700000001", visibility: "restricted", scope_kind: "organization.entities" },
    ]);
    // The contact identifiers are gone, other schemes are untouched, and the evidence points at the new rows.
    const left = await db.query(`SELECT id FROM organization.identifiers`);
    expect(left.map((r: { id: string }) => r.id)).toEqual([i3]);
    const kinds = await db.query(`SELECT target_kind, count(*)::int AS n FROM source.attributions WHERE target_kind IN ('contact.points', 'place.occupancies', 'place.places', 'organization.locations', 'organization.identifiers') GROUP BY 1 ORDER BY 1`);
    expect(kinds).toEqual([{ target_kind: "contact.points", n: 1 }, { target_kind: "place.occupancies", n: 2 }, { target_kind: "place.places", n: 2 }]);

    expect((await migrateLocations(db)).skipped).toContain("already migrated");
    void i2;
  });
});
