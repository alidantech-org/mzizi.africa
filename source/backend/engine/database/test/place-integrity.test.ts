import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { Client } from "pg";

import { openDataSource, withDatabase } from "../src/config.ts";
import { checkIntegrity } from "../src/integrity.ts";
import { migrate } from "../src/migrations.ts";
import { resolveContact } from "../src/places.ts";
import { seedFixtures, seedGovernanceStructure, seedReference } from "../src/seeds.ts";

/** Failing-case tests for the evidence, pattern-version and contact rules of the physical layer (TSK-4864E3B1AD5E). Needs TEST_DATABASE_URL. */
const adminUrl = process.env.TEST_DATABASE_URL;
const scratch = process.env.TEST_H4_DB ?? "mzizi_test_h4_integrity";
const run = adminUrl ? describe : describe.skip;

run("place integrity rules", () => {
  let db: Awaited<ReturnType<typeof openDataSource>>;
  const meta = `created_at, updated_at, version, is_current`;
  const mv = `now(), now(), 1, true`;
  let roles: string[] = [];
  let institutions: string[] = [];
  let method: string;
  let publisher: string;

  const one = async (sql: string, args: unknown[] = []) => (await db.query(sql, args))[0].id as string;
  const place = (name: string, parent?: string) => one(`INSERT INTO place.places (kind, status, name, parent_id, ${meta}) VALUES ($1, 'in_use', $2, $3, ${mv}) RETURNING id`, [parent ? "structure" : "site", name, parent ?? null]);
  const occupy = (subjectId: string, placeId: string, status = "active") => one(`INSERT INTO place.occupancies (subject_kind, subject_id, place_id, role_id, status, ${meta}) VALUES ('governance.institutions', $1, $2, $3, $4, ${mv}) RETURNING id`, [subjectId, placeId, roles[0], status]);
  const expect_ = (subjectId: string, status = "expected", resolved: string | null = null) =>
    one(`INSERT INTO place.expectations (subject_kind, subject_id, role_id, min_count, max_count, basis, status, resolved_occupancy_id, ${meta}) VALUES ('governance.institutions', $1, $2, 1, 1, 'pattern', $3, $4, ${mv}) RETURNING id`, [subjectId, roles[0], status, resolved]);
  const contact = (scopeKind: string, scopeId: string, value: string, visibility = "public") => one(`INSERT INTO contact.points (scope_kind, scope_id, channel, value, visibility, ${meta}) VALUES ($1, $2, 'phone', $3, $4, ${mv}) RETURNING id`, [scopeKind, scopeId, value, visibility]);
  const document = (title: string) => one(`INSERT INTO source.documents (publisher_id, title, kind_id, created_at, updated_at, version) SELECT $1, $2, id, now(), now(), 1 FROM reference.classifications WHERE scheme = 'source/document-kind' LIMIT 1 RETURNING id`, [publisher, title]);
  const attribute = (documentId: string, kind: string, id: string) => db.query(`INSERT INTO source.attributions (document_id, method_id, target_kind, target_id, relation, created_at, updated_at, version) VALUES ($1, $2, $3, $4, 'supports', now(), now(), 1)`, [documentId, method, kind, id]);
  const rules = async () => (await checkIntegrity(db)).map((issue) => issue.rule);
  let evidence: string;

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
    roles = (await db.query(`SELECT id FROM reference.classifications ORDER BY code LIMIT 4`)).map((row: { id: string }) => row.id);
    institutions = (await db.query(`SELECT id FROM governance.institutions ORDER BY code LIMIT 4`)).map((row: { id: string }) => row.id);
    publisher = await one(`INSERT INTO source.publishers (code, name, kind_id, created_at, updated_at, version) SELECT 'h4-test', 'h4 test', id, now(), now(), 1 FROM reference.classifications WHERE scheme = 'source/publisher-kind' LIMIT 1 RETURNING id`);
    method = await one(`INSERT INTO source.methods (kind, name, tool, tool_version, created_at, updated_at, version) VALUES ('curated', 'h4 test', 'h4', '1', now(), now(), 1) RETURNING id`);
    evidence = await document("H4 evidence document");
  }, 180_000);

  afterAll(async () => {
    await db?.destroy();
  });

  test("a place and an occupancy need an attribution; an expectation is not evidence of a building", async () => {
    const bare = await place("Bare place");
    const occupancy = await occupy(institutions[0]!, bare);
    expect(await rules()).toEqual(expect.arrayContaining(["places without an attribution", "occupancies without an attribution"]));
    await attribute(evidence, "place.places", bare);
    await attribute(evidence, "place.occupancies", occupancy);
    const after = await rules();
    expect(after).not.toContain("places without an attribution");
    expect(after).not.toContain("occupancies without an attribution");
  });

  test("an identified expectation needs an attributed occupancy that is still in force", async () => {
    const site = await place("Resolved site");
    await attribute(evidence, "place.places", site);
    const bare = await occupy(institutions[1]!, site);
    await expect_(institutions[1]!, "identified", bare);
    expect(await rules()).toContain("expectations resolved by an occupancy without an attribution");
    await attribute(evidence, "place.occupancies", bare);
    expect(await rules()).not.toContain("expectations resolved by an occupancy without an attribution");
    await db.query(`UPDATE place.occupancies SET status = 'closed', valid_to = '2026-01-01' WHERE id = $1`, [bare]);
    expect(await rules()).toContain("expectations resolved by an occupancy that has moved or closed");
  });

  test("occupancy and expectation targets must exist, and an expectation cannot resolve to a nonexistent occupancy", async () => {
    const site = await place("Ghost site");
    await attribute(evidence, "place.places", site);
    await occupy(randomUUID(), site);
    await db.query(`INSERT INTO place.expectations (subject_kind, subject_id, role_id, min_count, max_count, basis, status, ${meta}) VALUES ('governance.institutions', $1, $2, 1, 1, 'plan', 'expected', ${mv})`, [randomUUID(), roles[0]]);
    await db.query(`ALTER TABLE place.expectations DISABLE TRIGGER ALL`);
    await expect_(institutions[2]!, "identified", randomUUID());
    await db.query(`ALTER TABLE place.expectations ENABLE TRIGGER ALL`);
    const reported = await rules();
    expect(reported).toContain("place.occupancies (governance.institutions) -> governance.institutions");
    expect(reported).toContain("place.expectations (governance.institutions) -> governance.institutions");
    expect(reported).toContain("place.expectations.resolvedOccupancyId -> place.occupancies");
  });

  test("generated rows must match the newest version of their pattern", async () => {
    const v1 = await document("Office pattern h4-test version 1");
    const exp = await expect_(institutions[3]!);
    await attribute(v1, "place.expectations", exp);
    expect(await rules()).not.toContain("place.expectations rows generated by a pattern but not matching its newest version");
    const v2 = await document("Office pattern h4-test version 2");
    expect(await rules()).toContain("place.expectations rows generated by a pattern but not matching its newest version");
    await attribute(v2, "place.expectations", exp);
    expect(await rules()).not.toContain("place.expectations rows generated by a pattern but not matching its newest version");
    await db.query(`UPDATE place.expectations SET is_current = false WHERE id = $1`, [exp]);
  });

  test("contact points: a person's contact is never public and a public contact names its source", async () => {
    const site = await place("Contact site");
    await attribute(evidence, "place.places", site);
    const personContact = await contact("person.individuals", randomUUID(), "+254700111111", "public");
    const bare = await contact("place.places", site, "+254700222222", "public");
    const reported = await rules();
    expect(reported).toContain("contact points of a person that are not restricted");
    expect(reported).toContain("public contact points without an attribution");
    await db.query(`UPDATE contact.points SET visibility = 'restricted' WHERE id = $1`, [personContact]);
    await attribute(evidence, "contact.points", bare);
    const fixed = await rules();
    expect(fixed).not.toContain("contact points of a person that are not restricted");
    expect(fixed).not.toContain("public contact points without an attribution");
  });

  test("contact fallback never crosses subjects", async () => {
    const compound = await place("Shared compound");
    const [a, b, c] = [institutions[0]!, institutions[1]!, institutions[2]!];
    await occupy(a, compound);
    await occupy(b, compound);
    await contact("governance.institutions", a, "+254711000001");
    // two bodies share the place: nothing may be borrowed from either for the place itself
    expect(await resolveContact(db, { kind: "place.places", id: compound }, "phone")).toBeUndefined();
    // named subject B has no contact, and A's must not be returned for it
    expect(await resolveContact(db, { kind: "place.places", id: compound }, "phone", { subject: { kind: "governance.institutions", id: b } })).toBeUndefined();
    // named subject A gets its own
    expect((await resolveContact(db, { kind: "place.places", id: compound }, "phone", { subject: { kind: "governance.institutions", id: a } }))?.value).toBe("+254711000001");
    // a place with one occupant still falls back to that occupant
    const solo = await place("Solo site");
    await occupy(c, solo);
    await contact("governance.institutions", c, "+254711000003");
    expect((await resolveContact(db, { kind: "place.places", id: solo }, "phone"))?.value).toBe("+254711000003");
    // a child space of the shared compound inherits the place chain contact only, not an occupant's
    const wing = await place("Wing", compound);
    expect(await resolveContact(db, { kind: "place.places", id: wing }, "phone")).toBeUndefined();
    await contact("place.places", compound, "+254711000099");
    expect((await resolveContact(db, { kind: "place.places", id: wing }, "phone"))?.value).toBe("+254711000099");
  });
});
