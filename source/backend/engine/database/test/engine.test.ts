import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { Client } from "pg";

import { openDataSource, withDatabase } from "../src/config.ts";
import { checkCollection } from "../src/gate.ts";
import { checkIntegrity } from "../src/integrity.ts";
import { drift, migrate } from "../src/migrations.ts";
import { seedFixtures, seedReference, seedSiteFixtures } from "../src/seeds.ts";

/** Runs against a scratch database on the server in TEST_DATABASE_URL (skipped without it). */
const adminUrl = process.env.TEST_DATABASE_URL;
const scratch = "mzizi_engine_test";
const run = adminUrl ? describe : describe.skip;

run("database engine", () => {
  let db: Awaited<ReturnType<typeof openDataSource>>;

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
    await seedSiteFixtures(db, ids);
  }, 120_000);

  afterAll(async () => {
    await db?.destroy();
  });

  test("migrations create every entity table and the engine's own tables", async () => {
    const [{ count }] = await db.query(`SELECT count(*)::int AS count FROM information_schema.tables WHERE table_schema IN ('staging') AND table_name IN ('runs','candidates','issues')`);
    expect(count).toBe(3);
    const [{ migrations }] = await db.query(`SELECT count(*)::int AS migrations FROM engine.migrations`);
    expect(migrations).toBeGreaterThanOrEqual(3);
  });

  test("seeds the site-tag vocabulary as classification records", async () => {
    const [{ count }] = await db.query(`SELECT count(*)::int AS count FROM reference.classifications WHERE scheme = 'site-tag'`);
    expect(count).toBeGreaterThan(40);
  });

  test("entities and migrations have not drifted", async () => {
    expect(await drift()).toEqual([]);
  }, 120_000);

  test("clean fixtures satisfy every integrity rule", async () => {
    expect(await checkIntegrity(db)).toEqual([]);
  });

  test("derives a PostGIS shape per boundary and flags invalid GeoJSON", async () => {
    const [{ id: unitId }] = await db.query(`SELECT id FROM geography.units LIMIT 1`);
    const [{ next }] = await db.query(`SELECT coalesce(max(version_number), 0) + 1 AS next FROM geography.boundaries WHERE unit_id = $1`, [unitId]);
    const insert = async (geometry: string, versionNumber: number) => {
      const id = randomUUID();
      await db.query(`INSERT INTO geography.boundaries (id, geometry, is_current, unit_id, version, version_number, created_at, updated_at) VALUES ($1, $2, false, $3, 1, $4, now(), now())`, [id, geometry, unitId, versionNumber]);
      return id;
    };
    const good = await insert(JSON.stringify({ type: "Polygon", coordinates: [[[36, -1], [37, -1], [37, -2], [36, -2], [36, -1]]] }), next);
    const bad = await insert("not geojson", next + 1);
    const [goodShape] = await db.query(`SELECT is_valid FROM geography.boundary_shapes WHERE boundary_id = $1`, [good]);
    const [badShape] = await db.query(`SELECT is_valid FROM geography.boundary_shapes WHERE boundary_id = $1`, [bad]);
    expect(goodShape.is_valid).toBe(true);
    expect(badShape.is_valid).toBe(false);
    const issues = await checkIntegrity(db);
    expect(issues.map((issue) => issue.rule)).toContain("geography.boundaries without a valid derived shape");
  });

  test("reports a plain-id reference that resolves to nothing", async () => {
    const [{ id: documentId }] = await db.query(`SELECT id FROM source.documents LIMIT 1`);
    await db.query(`INSERT INTO source.captures (id, document_id, retrieved_at, site_id, created_at, updated_at, version) VALUES ($1, $2, now(), $3, now(), now(), 1)`, [randomUUID(), documentId, randomUUID()]);
    const issues = await checkIntegrity(db);
    expect(issues.map((issue) => issue.rule)).toContain("source.captures.siteId -> website.sites");
  });

  test("the database gate reads the current assessment and the jurisdiction dossier", async () => {
    const [site] = await db.query(`SELECT id, jurisdiction_id AS jurisdiction FROM website.sites WHERE code = 'ke/treasury'`);
    const request = { siteId: site.id, host: "treasury.go.ke", path: "/publications/a.pdf", purpose: "collect" as const, requestsPerSecond: 0.2 };
    expect((await checkCollection(db, request)).allowed).toBe(false);

    const assessmentId = randomUUID();
    await db.query(
      `INSERT INTO website.assessments (id, site_id, jurisdiction_id, status, source_type, access_basis, rights_holder, personal_data_categories, approved_scope, reviewed_by, reviewed_at, review_due_at, is_current, created_at, updated_at, version)
       VALUES ($1, $2, $3, 'approved', 'official_website', 'published_terms', 'unknown', '["none_known"]', $4, $5, now(), now() + interval '1 year', true, now(), now(), 1)`,
      [assessmentId, site.id, site.jurisdiction, JSON.stringify({ hosts: ["treasury.go.ke"], maxRequestsPerSecond: 0.5 }), randomUUID()],
    );
    const withoutDossier = await checkCollection(db, request);
    expect(withoutDossier.allowed).toBe(false);
    expect(withoutDossier.reasons.join(" ")).toContain("dossier");

    await db.query(
      `INSERT INTO website.dossiers (id, jurisdiction_id, applicable_laws, launch_stage, is_current, created_at, updated_at, version) VALUES ($1, $2, '[]', 'pilot', true, now(), now(), 1)`,
      [randomUUID(), site.jurisdiction],
    );
    expect(await checkCollection(db, request)).toMatchObject({ allowed: true, assessmentId });
    expect((await checkCollection(db, { ...request, host: "elsewhere.example" })).allowed).toBe(false);
  });

  test("integrity reports a site capture that has no covering assessment", async () => {
    const [site] = await db.query(`SELECT id FROM website.sites WHERE code = 'ke/knbs'`);
    const [{ id: documentId }] = await db.query(`SELECT id FROM source.documents LIMIT 1`);
    await db.query(`INSERT INTO source.captures (id, document_id, retrieved_at, site_id, created_at, updated_at, version) VALUES ($1, $2, now(), $3, now(), now(), 1)`, [randomUUID(), documentId, site.id]);
    const issues = await checkIntegrity(db);
    expect(issues.map((issue) => issue.rule)).toContain("captures of a site without a covering assessment");
  });

  test("integrity reports overlapping primary domains for one site", async () => {
    const [site] = await db.query(`SELECT id FROM website.sites WHERE code = 'ke/iebc'`);
    await db.query(`INSERT INTO website.domains (id, site_id, hostname, scheme, role, valid_from, valid_from_precision, created_at, updated_at, version) VALUES ($1, $2, 'iebc-two.example', 'https', 'primary', '2016-01-01', 'year', now(), now(), 1)`, [randomUUID(), site.id]);
    const issues = await checkIntegrity(db);
    expect(issues.map((issue) => issue.rule)).toContain("sites with overlapping primary domains");
  });
});
