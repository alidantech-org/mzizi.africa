import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { Client } from "pg";

import { openDataSource, withDatabase } from "../src/config.ts";
import { advanceDossier, autoAssess, decideAssessment, draftAssessment } from "../src/assessments.ts";
import { checkCollection } from "../src/gate.ts";
import { checkIntegrity } from "../src/integrity.ts";
import { drift, migrate } from "../src/migrations.ts";
import { seedDomainZones, seedExpectedSites, seedGovernanceStructure, seedDevAccounts, seedFixtures, seedReference, seedSiteFixtures } from "../src/seeds.ts";

/** Runs against a scratch database on the server in TEST_DATABASE_URL (skipped without it). */
const adminUrl = process.env.TEST_DATABASE_URL;
const scratch = process.env.TEST_SCRATCH_DB ?? "mzizi_test";
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
    expect(codes).toContain("candidate.promote");
    expect(codes).not.toContain("access.manage");
  });

  test("dev accounts are seeded once with their roles", async () => {
    await seedDevAccounts(db);
    await seedDevAccounts(db);
    const rows = await db.query(`SELECT a.subject, count(g.id)::int AS grants FROM identity.accounts a JOIN identity.grants g ON g.account_id = a.id WHERE a.issuer = 'mzizi-dev' GROUP BY a.subject ORDER BY a.subject`);
    expect(rows.map((row: { subject: string }) => row.subject)).toEqual(["dev-admin", "dev-reviewer"]);
    const [agent] = await db.query(`SELECT a.issuer, count(g.id)::int AS grants FROM identity.accounts a JOIN identity.grants g ON g.account_id = a.id WHERE a.subject = 'mzizi-agent' GROUP BY a.issuer`);
    expect(agent).toEqual({ issuer: "agent-mzizi", grants: 1 });
  });

  test("an active account holding assessment.approve decides an assessment (a person or an AI agent), and a decision supersedes the row", async () => {
    await seedDevAccounts(db);
    const [site] = await db.query(`INSERT INTO website.sites (code, name, kind, status, created_at, updated_at, version) VALUES ($1, 'Assessed', 'portal', 'expected', now(), now(), 1) RETURNING id`, [`assess-${randomUUID()}`]);
    const [draft] = await db.query(
      `INSERT INTO website.assessments (site_id, status, source_type, access_basis, rights_holder, personal_data_categories, approved_scope, rationale, is_current, created_at, updated_at, version)
       VALUES ($1, 'in_review', 'official_website', $2, 'unknown', '["none_known"]', '{"hosts":["a.example"]}', 'drafted by an agent', true, now(), now(), 1) RETURNING id`,
      [site.id, (await db.query(`SELECT unnest(enum_range(NULL::website.assessments_access_basis_enum))::text AS v LIMIT 1`))[0].v],
    );
    const reviewer = "00000000-0000-4000-8000-0000000000a1";
    const admin = "00000000-0000-4000-8000-0000000000a2";
    const [reader] = await db.query(`INSERT INTO identity.accounts (issuer, subject, status, created_at, updated_at, version) VALUES ('mzizi-dev', 'plain-reader', 'active', now(), now(), 1) RETURNING id`);
    await db.query(`INSERT INTO identity.grants (account_id, role, is_current, created_at, updated_at, version) VALUES ($1, 'reader', true, now(), now(), 1)`, [reader.id]);
    await expect(decideAssessment(db, draft.id, reader.id, "approved")).rejects.toThrow(/assessment.approve/);
    const decision = await decideAssessment(db, draft.id, admin, "approved");
    const rows = await db.query(`SELECT id, status::text AS status, is_current, reviewed_by, supersedes_id FROM website.assessments WHERE site_id = $1 ORDER BY created_at, status`, [site.id]);
    expect(rows).toHaveLength(2);
    expect(rows.find((row: { id: string }) => row.id === draft.id).is_current).toBe(false);
    const current = rows.find((row: { id: string }) => row.id === decision.newAssessmentId);
    expect(current).toMatchObject({ status: "approved", is_current: true, reviewed_by: admin, supersedes_id: draft.id });
    await expect(decideAssessment(db, draft.id, admin, "rejected")).rejects.toThrow(/current/);
  });

  test("a reviewer drafts an assessment as in_review, supersedes the current row, and a draft never allows collection", async () => {
    await seedDevAccounts(db);
    const reviewer = "00000000-0000-4000-8000-0000000000a1";
    const [site] = await db.query(`INSERT INTO website.sites (code, name, kind, status, created_at, updated_at, version) VALUES ($1, 'Drafted', 'portal', 'expected', now(), now(), 1) RETURNING id`, [`draft-${randomUUID()}`]);
    const draft = { siteId: site.id, accessBasis: "published_terms", sourceType: "official_website", rightsHolder: "Example Ministry", approvedScope: JSON.stringify({ hosts: ["drafted.example"] }), rationale: "terms reviewed" };
    const first = await draftAssessment(db, reviewer, draft);
    const second = await draftAssessment(db, reviewer, { ...draft, rationale: "second pass" });
    const rows = await db.query(`SELECT id, status::text AS status, is_current, supersedes_id, reviewed_by FROM website.assessments WHERE site_id = $1`, [site.id]);
    expect(rows).toHaveLength(2);
    expect(rows.find((row: { id: string }) => row.id === first.assessmentId).is_current).toBe(false);
    expect(rows.find((row: { id: string }) => row.id === second.assessmentId)).toMatchObject({ status: "in_review", is_current: true, supersedes_id: first.assessmentId, reviewed_by: null });
    const outsider = randomUUID();
    await expect(draftAssessment(db, outsider, draft)).rejects.toThrow(/assessment.draft/);
    const gate = await checkCollection(db, { siteId: site.id, host: "drafted.example", path: "/a", purpose: "collect", requestsPerSecond: 0.2 });
    expect(gate.allowed).toBe(false);
  });

  test("trusted-domain sites are approved by the agent account and become collectable once the dossier is at pilot", async () => {
    await seedDevAccounts(db);
    const agent = "00000000-0000-4000-8000-0000000000a3";
    const [ke] = await db.query(`SELECT id FROM reference.jurisdictions WHERE code = 'ke'`);
    const [site] = await db.query(`INSERT INTO website.sites (code, name, kind, status, jurisdiction_id, created_at, updated_at, version) VALUES ($1, 'Trusted', 'portal', 'expected', $2, now(), now(), 1) RETURNING id`, [`trusted-${randomUUID()}`, ke.id]);
    await db.query(`INSERT INTO website.domains (site_id, hostname, scheme, role, valid_from, valid_from_precision, created_at, updated_at, version) VALUES ($1, 'www.example.go.ke', 'https', 'primary', '2020-01-01', 'year', now(), now(), 1)`, [site.id]);
    const [other] = await db.query(`INSERT INTO website.sites (code, name, kind, status, jurisdiction_id, created_at, updated_at, version) VALUES ($1, 'Untrusted', 'portal', 'expected', $2, now(), now(), 1) RETURNING id`, [`untrusted-${randomUUID()}`, ke.id]);
    await db.query(`INSERT INTO website.domains (site_id, hostname, scheme, role, valid_from, valid_from_precision, created_at, updated_at, version) VALUES ($1, 'www.example.com', 'https', 'primary', '2020-01-01', 'year', now(), now(), 1)`, [other.id]);

    const [dossier] = await db.query(`SELECT id FROM website.dossiers WHERE jurisdiction_id = $1 AND is_current`, [ke.id]);
    if (!dossier) await db.query(`INSERT INTO website.dossiers (id, jurisdiction_id, applicable_laws, launch_stage, is_current, created_at, updated_at, version) VALUES ($1, $2, '[]', 'research', true, now(), now(), 1)`, [randomUUID(), ke.id]);
    const result = await autoAssess(db, agent);
    expect(result.approved.some((code: string) => code.startsWith("trusted-"))).toBe(true);
    expect(result.skipped.some((code: string) => code.startsWith("untrusted-"))).toBe(true);
    const [row] = await db.query(`SELECT status::text AS status, reviewed_by, jurisdiction_id FROM website.assessments WHERE site_id = $1 AND is_current`, [site.id]);
    expect(row).toMatchObject({ status: "approved", reviewed_by: agent });
    const request = { siteId: site.id, host: "www.example.go.ke", path: "/a.pdf", purpose: "collect" as const, requestsPerSecond: 0.2 };
    const blocked = await checkCollection(db, request);
    if (!blocked.allowed) expect(blocked.reasons.join(" ")).toContain("dossier");
    await advanceDossier(db, agent, "ke", "pilot");
    expect((await checkCollection(db, request)).allowed).toBe(true);
    expect((await checkCollection(db, { ...request, host: "www.example.com" })).allowed).toBe(false);
    await db.query(`UPDATE website.dossiers SET supersedes_id = NULL WHERE jurisdiction_id = $1`, [ke.id]);
    await db.query(`DELETE FROM website.dossiers WHERE jurisdiction_id = $1`, [ke.id]);
  });

  test("the governance structure seed is idempotent, labelled as manual research and every parent exists", async () => {
    const first = await seedGovernanceStructure(db);
    expect(first.institutions).toBeGreaterThan(90);
    expect(first.relationships).toBeGreaterThan(60);
    const second = await seedGovernanceStructure(db);
    expect(second).toEqual({ institutions: 0, relationships: 0, counties: 0 });
    const file = JSON.parse(await Bun.file(new URL("../fixtures/seed/ke-governance-structure.json", import.meta.url)).text());
    expect(file._meta.label).toBe("Custom-prepared from manual research");
    const codes = new Set<string>(file.institutions.map((row: { code: string }) => row.code));
    expect(codes.size).toBe(file.institutions.length);
    for (const row of file.institutions) if (row.parent) expect(codes.has(row.parent), `${row.code} has unknown parent ${row.parent}`).toBe(true);
    const [row] = await db.query(`SELECT description FROM governance.institutions WHERE code = 'ke/kra'`);
    expect(row.description).toContain("manual research");
  }, 300_000);

  test("expected sites are registered once, unverified, and linked to their institutions", async () => {
    await seedGovernanceStructure(db);
    const first = await seedExpectedSites(db);
    expect(first.sites).toBeGreaterThan(80);
    expect(first.linked).toBeGreaterThan(75);
    expect(await seedExpectedSites(db)).toEqual({ sites: 0, linked: 0, domains: 0 });
    const [row] = await db.query(`SELECT s.status::text AS status, (SELECT count(*)::int FROM website.domains d WHERE d.site_id = s.id) AS domains FROM website.sites s WHERE s.code = 'ke/nca'`);
    expect(row).toEqual({ status: "expected", domains: 1 });
    const [dom] = await db.query(`SELECT d.status::text AS status, d.origin::text AS origin, d.role::text AS role FROM website.domains d JOIN website.sites s ON s.id = d.site_id WHERE s.code = 'ke/nca' ORDER BY d.role`);
    expect(dom).toEqual({ status: "candidate", origin: "seed_research", role: "primary" });
  }, 300_000);

  test("domain model keeps candidate, redirect and snapshot history", async () => {
    expect(await seedDomainZones(db)).toEqual({ zones: 12 });
    expect(await seedDomainZones(db)).toEqual({ zones: 0 });
    const [zone] = await db.query(`SELECT id FROM website.domain_zones WHERE suffix = 'go.ke'`);
    const [site] = await db.query(`SELECT id FROM website.sites LIMIT 1`);
    const [apex] = await db.query(
      `INSERT INTO website.domains (site_id, hostname, scheme, role, valid_from, valid_from_precision, zone_id, origin, status_reason, is_apex, created_at, updated_at, version) VALUES ($1, 'example.go.ke', 'https', 'alias', '2026-11-02', 'exact', $2, 'pattern', 'from the county pattern', true, now(), now(), 1) RETURNING id, status::text AS status`,
      [site.id, zone.id],
    );
    expect(apex.status).toBe("candidate");
    const [sub] = await db.query(
      `INSERT INTO website.domains (site_id, hostname, scheme, role, valid_from, valid_from_precision, parent_domain_id, status, redirect_to, last_http_status, created_at, updated_at, version) VALUES ($1, 'www.example.go.ke', 'https', 'redirect', '2026-11-02', 'exact', $2, 'redirects', 'https://example.go.ke/', 301, now(), now(), 1) RETURNING status::text AS status`,
      [site.id, apex.id],
    );
    expect(sub.status).toBe("redirects");
    for (const [at, values] of [["2026-11-02T10:00:00Z", '["192.0.2.1"]'], ["2026-11-03T10:00:00Z", '["192.0.2.2"]']]) {
      await db.query(`INSERT INTO website.dns_snapshots (domain_id, record_type, values, resolver, observed_at, created_at) VALUES ($1, 'A', $2, '1.1.1.1', $3, now())`, [apex.id, values, at]);
    }
    const history = await db.query(`SELECT values FROM website.dns_snapshots WHERE domain_id = $1 AND record_type = 'A' ORDER BY observed_at`, [apex.id]);
    expect(history.map((row: { values: string }) => row.values)).toEqual(['["192.0.2.1"]', '["192.0.2.2"]']);
  });

  test("staging rows track updated_at and version", async () => {
    const [run] = await db.query(`INSERT INTO staging.runs (dataset, mapping_version) VALUES ('t', '1') RETURNING id`);
    await db.query(`UPDATE staging.runs SET status = 'running' WHERE id = $1`, [run.id]);
    const [row] = await db.query(`SELECT version FROM staging.runs WHERE id = $1`, [run.id]);
    expect(row.version).toBe(2);
  });

  test("statistics store multi-dimensional figures, rates with a denominator and derived values", async () => {
    const meta = `created_at, updated_at, version, is_current`;
    const mv = `now(), now(), 1, true`;
    const one = async (sql: string, args: unknown[] = []) => (await db.query(sql, args))[0].id as string;
    const cat = await one(`INSERT INTO statistical.categories (code, label, ${meta}) VALUES ('t-cat', 'Population', ${mv}) RETURNING id`);
    const ind = await one(`INSERT INTO statistical.indicators (category_id, code, name, ${meta}) VALUES ($1, 't-ind', 'Population', ${mv}) RETURNING id`, [cat]);
    const per = await one(`INSERT INTO statistical.periods (code, granularity, starts_on, ends_on, ${meta}) VALUES ('t-2019', 'year', '2019-08-24', '2019-08-24', ${mv}) RETURNING id`);
    const jur = (await db.query(`SELECT id FROM reference.jurisdictions LIMIT 1`))[0].id;
    const tab = await one(`INSERT INTO statistical.datasets (jurisdiction_id, code, title, ${meta}) VALUES ($1, 't-tab', 'Census 2019', ${mv}) RETURNING id`, [jur]);
    const vin = await one(`INSERT INTO statistical.vintages (code, label, ${meta}) VALUES ('knbs-2019-vol1', 'KNBS 2019 Census Vol I', ${mv}) RETURNING id`);
    const sex = await one(`INSERT INTO statistical.dimensions (code, name, ${meta}) VALUES ('sex', 'Sex', ${mv}) RETURNING id`);
    const age = await one(`INSERT INTO statistical.dimensions (code, name, ${meta}) VALUES ('age-group', 'Age group', ${mv}) RETURNING id`);
    const female = await one(`INSERT INTO statistical.dimension_members (dimension_id, code, label, reference_code, ${meta}) VALUES ($1, 'female', 'Female', 'F', ${mv}) RETURNING id`, [sex]);
    const a1519 = await one(`INSERT INTO statistical.dimension_members (dimension_id, code, label, sort_order, ${meta}) VALUES ($1, '15-19', '15 to 19', 4, ${mv}) RETURNING id`, [age]);
    const obs = (value: number, extra = "", args: unknown[] = []) =>
      one(`INSERT INTO statistical.observations (table_id, indicator_id, period_id, numeric_value, confidence_level, vintage_id, ${extra ? extra.split("=")[0] + "," : ""} ${meta}) VALUES ($1, $2, $3, $4, 'high', $5, ${extra ? "$6," : ""} ${mv}) RETURNING id`, [tab, ind, per, value, vin, ...args]);
    const figure = await obs(1200);
    await db.query(`UPDATE statistical.observations SET measure_type = 'count', estimate_kind = 'census', release_label = 'Vol I' WHERE id = $1`, [figure]);
    await db.query(`INSERT INTO statistical.observation_dimensions (observation_id, dimension_id, member_id, ${meta}) VALUES ($1, $2, $3, ${mv}), ($1, $4, $5, ${mv})`, [figure, sex, female, age, a1519]);
    await expect(db.query(`INSERT INTO statistical.observation_dimensions (observation_id, dimension_id, member_id, ${meta}) VALUES ($1, $2, $3, ${mv})`, [figure, sex, female])).rejects.toThrow();
    const denom = await obs(4800);
    const rate = await obs(25, "denominator_observation_id=", [denom]);
    await db.query(`UPDATE statistical.observations SET measure_type = 'percentage', estimate_kind = 'derived', margin_of_error = 1.2, denominator_value = 4800 WHERE id = $1`, [rate]);
    await db.query(`INSERT INTO statistical.observation_derivations (observation_id, input_observation_id, computation, input_role, ${meta}) VALUES ($1, $2, 'figure / denominator * 100', 'numerator', ${mv}), ($1, $3, 'figure / denominator * 100', 'denominator', ${mv})`, [rate, figure, denom]);
    const dims = await db.query(`SELECT d.code AS dimension, m.code AS member FROM statistical.observation_dimensions od JOIN statistical.dimensions d ON d.id = od.dimension_id JOIN statistical.dimension_members m ON m.id = od.member_id WHERE od.observation_id = $1 ORDER BY d.code`, [figure]);
    expect(dims.map((row: any) => `${row.dimension}:${row.member}`)).toEqual(["age-group:15-19", "sex:female"]);
    const [stored] = await db.query(`SELECT measure_type, estimate_kind, margin_of_error::float AS moe, denominator_observation_id FROM statistical.observations WHERE id = $1`, [rate]);
    expect(stored).toMatchObject({ measure_type: "percentage", estimate_kind: "derived", moe: 1.2, denominator_observation_id: denom });
    const [{ inputs }] = await db.query(`SELECT count(*)::int AS inputs FROM statistical.observation_derivations WHERE observation_id = $1`, [rate]);
    expect(inputs).toBe(2);
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
