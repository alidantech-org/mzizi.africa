import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { Client } from "pg";

import { openDataSource, withDatabase } from "../src/config.ts";
import { decideAssessment } from "../src/assessments.ts";
import { checkCollection } from "../src/gate.ts";
import { checkIntegrity } from "../src/integrity.ts";
import { drift, migrate } from "../src/migrations.ts";
import { seedDevAccounts, seedFixtures, seedReference, seedSiteFixtures } from "../src/seeds.ts";

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

  test("access catalogue resolves a current grant to its permissions", async () => {
    const [account] = await db.query(`INSERT INTO identity.accounts (issuer, subject, status, created_at, updated_at, version) VALUES ('test', $1, 'active', now(), now(), 1) RETURNING id`, [randomUUID()]);
    await db.query(`INSERT INTO identity.grants (account_id, role, is_current, created_at, updated_at, version) VALUES ($1, 'reviewer', true, now(), now(), 1)`, [account.id]);
    const rows = await db.query(`SELECT permission_code FROM access.account_permissions WHERE account_id = $1`, [account.id]);
    const codes = rows.map((row: { permission_code: string }) => row.permission_code);
    expect(codes).toContain("pipeline.read");
    expect(codes).not.toContain("candidate.promote");
  });

  test("dev accounts are seeded once with their roles", async () => {
    await seedDevAccounts(db);
    await seedDevAccounts(db);
    const rows = await db.query(`SELECT a.subject, count(g.id)::int AS grants FROM identity.accounts a JOIN identity.grants g ON g.account_id = a.id WHERE a.issuer = 'mzizi-dev' GROUP BY a.subject ORDER BY a.subject`);
    expect(rows).toEqual([{ subject: "dev-admin", grants: 1 }, { subject: "dev-reviewer", grants: 1 }]);
  });

  test("only a human holding assessment.approve decides an assessment, and a decision supersedes the row", async () => {
    await seedDevAccounts(db);
    const [site] = await db.query(`INSERT INTO website.sites (code, name, kind, status, created_at, updated_at, version) VALUES ($1, 'Assessed', 'portal', 'expected', now(), now(), 1) RETURNING id`, [`assess-${randomUUID()}`]);
    const [draft] = await db.query(
      `INSERT INTO website.assessments (site_id, status, source_type, access_basis, rights_holder, personal_data_categories, approved_scope, rationale, is_current, created_at, updated_at, version)
       VALUES ($1, 'in_review', 'official_website', $2, 'unknown', '["none_known"]', '{"hosts":["a.example"]}', 'drafted by an agent', true, now(), now(), 1) RETURNING id`,
      [site.id, (await db.query(`SELECT unnest(enum_range(NULL::website.assessments_access_basis_enum))::text AS v LIMIT 1`))[0].v],
    );
    const reviewer = "00000000-0000-4000-8000-0000000000a1";
    const admin = "00000000-0000-4000-8000-0000000000a2";
    await expect(decideAssessment(db, draft.id, reviewer, "approved")).rejects.toThrow(/assessment.approve/);
    const [agent] = await db.query(`INSERT INTO identity.accounts (issuer, subject, status, created_at, updated_at, version) VALUES ('agent-bot', 'a1', 'active', now(), now(), 1) RETURNING id`);
    await db.query(`INSERT INTO identity.grants (account_id, role, is_current, created_at, updated_at, version) VALUES ($1, 'admin', true, now(), now(), 1)`, [agent.id]);
    await expect(decideAssessment(db, draft.id, agent.id, "approved")).rejects.toThrow(/never decide/);
    const decision = await decideAssessment(db, draft.id, admin, "approved");
    const rows = await db.query(`SELECT id, status::text AS status, is_current, reviewed_by, supersedes_id FROM website.assessments WHERE site_id = $1 ORDER BY created_at, status`, [site.id]);
    expect(rows).toHaveLength(2);
    expect(rows.find((row: { id: string }) => row.id === draft.id).is_current).toBe(false);
    const current = rows.find((row: { id: string }) => row.id === decision.newAssessmentId);
    expect(current).toMatchObject({ status: "approved", is_current: true, reviewed_by: admin, supersedes_id: draft.id });
    await expect(decideAssessment(db, draft.id, admin, "rejected")).rejects.toThrow(/current/);
  });

  test("staging rows track updated_at and version", async () => {
    const [run] = await db.query(`INSERT INTO staging.runs (dataset, mapping_version) VALUES ('t', '1') RETURNING id`);
    await db.query(`UPDATE staging.runs SET status = 'running' WHERE id = $1`, [run.id]);
    const [row] = await db.query(`SELECT version FROM staging.runs WHERE id = $1`, [run.id]);
    expect(row.version).toBe(2);
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
