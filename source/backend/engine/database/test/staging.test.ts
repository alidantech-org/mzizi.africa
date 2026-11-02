import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { Client } from "pg";

import { openDataSource, withDatabase } from "../src/config.ts";
import { migrate } from "../src/migrations.ts";
import { seedFixtures, seedReference } from "../src/seeds.ts";
import { promoteCandidate } from "../src/staging/promotion.ts";
import { applyReviewDecisions } from "../src/staging/review.ts";
import { validateCandidates, validatePayload } from "../src/staging/validation.ts";

const adminUrl = process.env.TEST_DATABASE_URL;
const run = adminUrl ? describe : describe.skip;
const scratch = "mzizi_staging_test";

const square = (x: number, y: number, size: number) => JSON.stringify({ type: "Polygon", coordinates: [[[x, y], [x + size, y], [x + size, y - size], [x, y - size], [x, y]]] });
const KENYA = square(34, 5, 8); // roughly Kenya's extent
const INSIDE = square(36, -1, 1);
const OUTSIDE = square(100, 40, 1);

run("staging validation and promotion", () => {
  let db: Awaited<ReturnType<typeof openDataSource>>;
  let reviewer: string;
  let contributor: string;
  let documentId: string;
  let captureId: string;
  let runId: string;
  const ids: Record<string, string> = {};

  const ref = (code: string) => ({ $ref: { kind: "geography.units", where: { code } } });

  async function account(role: string): Promise<string> {
    const [a] = await db.query(`INSERT INTO identity.accounts (issuer, subject, status, created_at, updated_at, version) VALUES ('test', $1, 'active', now(), now(), 1) RETURNING id`, [randomUUID()]);
    await db.query(`INSERT INTO identity.grants (account_id, role, is_current, created_at, updated_at, version) VALUES ($1, $2, true, now(), now(), 1)`, [a.id, role]);
    return a.id;
  }

  async function candidate(target: string, payload: Record<string, unknown>, key: string[], opts: { status?: string; run?: string } = {}): Promise<string> {
    const [row] = await db.query(
      `INSERT INTO staging.candidates (run_id, target_kind, natural_key_hash, payload_hash, payload, extraction_result_id, method, status, key_fields) VALUES ($1, $2, $3, $4, $5, gen_random_uuid(), 'extracted', $6, $7) RETURNING id`,
      [opts.run ?? runId, target, randomUUID().replace(/-/g, "").padEnd(64, "0"), randomUUID().replace(/-/g, "").padEnd(64, "0"), JSON.stringify(payload), opts.status ?? "pending", key],
    );
    return row.id;
  }

  async function decide(candidateId: string, decision: string, by: string, state = "unverified", at = new Date()) {
    await db.query(`INSERT INTO audit.decisions (target_kind, target_id, decision, proposed_state, rationale, reviewer_id, created_at, updated_at, version) VALUES ('staging.candidates', $1, $2, $3, 'reviewed', $4, $5, $5, 1)`, [candidateId, decision, state, by, at]);
  }

  async function approve(c: string, by = reviewer, state = "unverified") {
    await validateCandidates(db);
    await decide(c, "approve", by, state);
    await applyReviewDecisions(db);
  }

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
    reviewer = await account("reviewer");
    contributor = await account("contributor");
    for (const code of ["ke", "ke/nairobi"]) ids[code] = (await db.query(`SELECT id FROM geography.units WHERE code = $1`, [code]))[0].id;
    // parent boundary so containment can be checked
    await db.query(`INSERT INTO geography.boundaries (geometry, is_current, unit_id, version, version_number, created_at, updated_at) VALUES ($1, true, $2, 1, 1, now(), now())`, [KENYA, ids.ke]);
    const [pub] = await db.query(`SELECT id FROM source.publishers LIMIT 1`);
    [{ id: documentId }] = await db.query(`INSERT INTO source.documents (publisher_id, kind_id, title, licence, created_at, updated_at, version) VALUES ($1, (SELECT id FROM reference.classifications WHERE scheme = 'source/document-kind' LIMIT 1), 'Boundary file', 'CC-BY-4.0', now(), now(), 1) RETURNING id`, [pub.id]);
    [{ id: captureId }] = await db.query(`INSERT INTO source.captures (document_id, retrieved_at, created_at, updated_at, version) VALUES ($1, now(), now(), now(), 1) RETURNING id`, [documentId]);
    [{ id: runId }] = await db.query(`INSERT INTO staging.runs (dataset, mapping_version, capture_id, status) VALUES ('test', 'v1', $1, 'completed') RETURNING id`, [captureId]);
  }, 180_000);

  afterAll(async () => {
    await db?.destroy();
  });

  test("a valid boundary with a reference by natural key goes to review", async () => {
    const issues = await validatePayload(db, "geography.boundaries", { unitId: ref("ke/nairobi"), geometry: INSIDE }, ["unitId"]);
    expect(issues.filter((i) => i.severity === "error")).toEqual([]);
  });

  test.each([
    ["unknown target", "nothing.here", {}, "unknown_target"],
    ["unknown field", "geography.boundaries", { unitId: "ke/nairobi", geometry: INSIDE, colour: "red" }, "unknown_field"],
    ["unresolved reference", "geography.boundaries", { unitId: ref("ke/atlantis"), geometry: INSIDE }, "reference"],
    ["missing required field", "geography.boundaries", { unitId: ref("ke/nairobi") }, "required"],
    ["unparseable geometry", "geography.boundaries", { unitId: ref("ke/nairobi"), geometry: "not json" }, "geometry"],
    ["self-intersecting geometry", "geography.boundaries", { unitId: ref("ke/nairobi"), geometry: JSON.stringify({ type: "Polygon", coordinates: [[[0, 0], [2, 2], [2, 0], [0, 2], [0, 0]]] }) }, "geometry"],
    ["out-of-range coordinates", "geography.boundaries", { unitId: ref("ke/nairobi"), geometry: square(500000, 9900000, 1000) }, "geometry"],
    ["boundary outside its parent", "geography.boundaries", { unitId: ref("ke/nairobi"), geometry: OUTSIDE }, "containment"],
    ["bare year as a date", "geography.boundaries", { unitId: ref("ke/nairobi"), geometry: INSIDE, validFrom: "2019" }, "type"],
    ["date without precision", "geography.boundaries", { unitId: ref("ke/nairobi"), geometry: INSIDE, validFrom: "2019-01-01" }, "date_precision"],
    ["money without currency", "finance.budgets", { approvedAmount: "100.00" }, "money"],
    ["empty natural key", "geography.boundaries", { unitId: null, geometry: INSIDE }, "natural_key"],
  ])("rejects: %s", async (_name, target, payload, rule) => {
    const issues = await validatePayload(db, target, payload as Record<string, unknown>, ["unitId"]);
    expect(issues.filter((i) => i.severity === "error").map((i) => i.rule)).toContain(rule);
  });

  test("a unit whose level is not below its parent's level is rejected", async () => {
    const county = (await db.query(`SELECT id FROM reference.classifications WHERE code = 'geography/level/county'`))[0].id;
    const issues = await validatePayload(db, "geography.units", { code: "ke/x", name: "X", kind: "territorial", isActive: true, jurisdictionId: (await db.query(`SELECT jurisdiction_id FROM geography.units WHERE code='ke'`))[0].jurisdiction_id, levelId: county, parentId: ids["ke/nairobi"] }, ["code"]);
    expect(issues.map((i) => i.rule)).toContain("level");
  });

  test("invalid candidates are marked invalid with issues; quarantined ones are never validated forward", async () => {
    const bad = await candidate("geography.boundaries", { unitId: ref("ke/nairobi"), geometry: OUTSIDE }, ["unitId"]);
    const quarantined = await candidate("geography.boundaries", { unitId: ref("ke/nairobi"), geometry: INSIDE }, ["unitId"], { status: "quarantined" });
    await validateCandidates(db);
    expect((await db.query(`SELECT status FROM staging.candidates WHERE id = $1`, [bad]))[0].status).toBe("invalid");
    expect((await db.query(`SELECT count(*)::int AS n FROM staging.issues WHERE candidate_id = $1 AND rule = 'containment'`, [bad]))[0].n).toBe(1);
    expect((await db.query(`SELECT status FROM staging.candidates WHERE id = $1`, [quarantined]))[0].status).toBe("quarantined");
    await decide(quarantined, "approve", reviewer);
    await applyReviewDecisions(db);
    const result = await promoteCandidate(db, quarantined);
    expect(result.outcome).toBe("deferred");
    expect(result.reasons.join(" ")).toContain("quarantined");
  });

  test("review, then promotion writes the record, attribution, verification and the promotion decision once", async () => {
    const c = await candidate("geography.boundaries", { unitId: ref("ke/nairobi"), geometry: INSIDE, referenceYear: 2019 }, ["unitId"]);
    await approve(c, reviewer, "verified");
    const result = await promoteCandidate(db, c);
    expect(result).toMatchObject({ outcome: "promoted", targetKind: "geography.boundaries" });
    const [row] = await db.query(`SELECT unit_id, is_current, version_number, reference_year FROM geography.boundaries WHERE id = $1`, [result.targetId]);
    expect(row).toMatchObject({ unit_id: ids["ke/nairobi"], is_current: true, version_number: 1, reference_year: 2019 });
    const [attr] = await db.query(`SELECT document_id, capture_id, relation, attributed_by FROM source.attributions WHERE target_kind = 'geography.boundaries' AND target_id = $1`, [result.targetId]);
    expect(attr).toMatchObject({ document_id: documentId, capture_id: captureId, relation: "supports", attributed_by: reviewer });
    const [verification] = await db.query(`SELECT state, is_current FROM source.verifications WHERE target_id = $1`, [result.targetId]);
    expect(verification).toMatchObject({ state: "verified", is_current: true });
    expect((await db.query(`SELECT is_valid FROM geography.boundary_shapes WHERE boundary_id = $1`, [result.targetId]))[0].is_valid).toBe(true);
    expect((await db.query(`SELECT status, resolved_target_id FROM staging.candidates WHERE id = $1`, [c]))[0]).toMatchObject({ status: "promoted", resolved_target_id: result.targetId });
    // idempotent
    expect(await promoteCandidate(db, c)).toMatchObject({ outcome: "promoted", targetId: result.targetId });
    expect((await db.query(`SELECT count(*)::int AS n FROM staging.promotions WHERE candidate_id = $1 AND outcome = 'promoted'`, [c]))[0].n).toBe(1);
    expect((await db.query(`SELECT count(*)::int AS n FROM geography.boundaries WHERE unit_id = $1`, [ids["ke/nairobi"]]))[0].n).toBe(1);
  });

  test("a changed candidate for the same key supersedes: new version, old closed, history kept", async () => {
    const before = (await db.query(`SELECT id FROM geography.boundaries WHERE unit_id = $1 AND is_current`, [ids["ke/nairobi"]]))[0].id;
    const c = await candidate("geography.boundaries", { unitId: ref("ke/nairobi"), geometry: square(36, -1, 1.2) }, ["unitId"]);
    await approve(c);
    const result = await promoteCandidate(db, c);
    expect(result).toMatchObject({ outcome: "promoted", previousTargetId: before });
    const old = (await db.query(`SELECT is_current, valid_to FROM geography.boundaries WHERE id = $1`, [before]))[0];
    expect(old.is_current).toBe(false);
    expect(old.valid_to).not.toBeNull();
    expect((await db.query(`SELECT version_number, is_current FROM geography.boundaries WHERE id = $1`, [result.targetId]))[0]).toMatchObject({ version_number: 2, is_current: true });
    const states = await db.query(`SELECT state, is_current FROM source.verifications WHERE target_id = $1 ORDER BY created_at, id`, [before]);
    expect(states.map((s: { state: string }) => s.state)).toEqual(["verified", "superseded"]);
    expect(states.filter((s: { is_current: boolean }) => s.is_current)).toHaveLength(1);
  });

  test("a decision by an account without the reviewer role is ignored and the candidate stays in review", async () => {
    const c = await candidate("geography.boundaries", { unitId: ref("ke/nairobi"), geometry: square(36, -1, 1.3) }, ["unitId"]);
    await validateCandidates(db);
    await decide(c, "approve", contributor);
    const tally = await applyReviewDecisions(db);
    expect(tally.ignored).toBeGreaterThanOrEqual(1);
    expect((await db.query(`SELECT status FROM staging.candidates WHERE id = $1`, [c]))[0].status).toBe("in_review");
    await db.query(`UPDATE staging.candidates SET status = 'approved' WHERE id = $1`, [c]); // forced, as if tampered with
    expect((await promoteCandidate(db, c)).reasons.join(" ")).toContain("reviewer");
  });

  test("a later dispute or rejection blocks promotion of an approved candidate", async () => {
    const c = await candidate("geography.boundaries", { unitId: ref("ke/nairobi"), geometry: square(36, -1, 1.4) }, ["unitId"]);
    await approve(c);
    await decide(c, "dispute", reviewer, "disputed", new Date(Date.now() + 60_000));
    const result = await promoteCandidate(db, c);
    expect(result.outcome).toBe("deferred");
    expect(result.reasons.join(" ")).toContain("approving review decision");
  });

  test("a source without a licence, or with a restricted or overdue legal status, is not promoted", async () => {
    const [doc] = await db.query(`INSERT INTO source.documents (publisher_id, kind_id, title, created_at, updated_at, version) SELECT publisher_id, kind_id, 'No licence', now(), now(), 1 FROM source.documents WHERE id = $1 RETURNING id`, [documentId]);
    const [cap] = await db.query(`INSERT INTO source.captures (document_id, retrieved_at, created_at, updated_at, version) VALUES ($1, now(), now(), now(), 1) RETURNING id`, [doc.id]);
    const [r] = await db.query(`INSERT INTO staging.runs (dataset, mapping_version, capture_id, status) VALUES ('nolicence', 'v1', $1, 'completed') RETURNING id`, [cap.id]);
    const c = await candidate("geography.boundaries", { unitId: ref("ke/nairobi"), geometry: square(36, -1, 1.5) }, ["unitId"], { run: r.id });
    await approve(c);
    expect((await promoteCandidate(db, c)).reasons.join(" ")).toContain("no licence");

    const [jur] = await db.query(`SELECT id FROM reference.jurisdictions WHERE code = 'ke'`);
    const [site] = await db.query(`INSERT INTO website.sites (code, name, kind, status, jurisdiction_id, created_at, updated_at, version) VALUES ('ke/staging-test-site', 'Staging test site', 'portal', 'active', $1, now(), now(), 1) RETURNING id`, [jur.id]);
    await db.query(`INSERT INTO website.assessments (site_id, jurisdiction_id, status, source_type, access_basis, rights_holder, personal_data_categories, approved_scope, is_current, created_at, updated_at, version) VALUES ($1, $2, 'restricted', 'official_website', 'published_terms', 'unknown', '["none_known"]', '{"hosts":["x.example.org"]}', true, now(), now(), 1)`, [site.id, jur.id]);
    const [cap2] = await db.query(`INSERT INTO source.captures (document_id, retrieved_at, site_id, created_at, updated_at, version) VALUES ($1, now(), $2, now(), now(), 1) RETURNING id`, [documentId, site.id]);
    const [r2] = await db.query(`INSERT INTO staging.runs (dataset, mapping_version, capture_id, status) VALUES ('restricted', 'v1', $1, 'completed') RETURNING id`, [cap2.id]);
    const c2 = await candidate("geography.boundaries", { unitId: ref("ke/nairobi"), geometry: square(36, -1, 1.6) }, ["unitId"], { run: r2.id });
    await approve(c2);
    expect((await promoteCandidate(db, c2)).reasons.join(" ")).toContain("legal status is restricted");
    await db.query(`UPDATE website.assessments SET status = 'approved', reviewed_by = gen_random_uuid(), reviewed_at = now(), review_due_at = now() - interval '1 day' WHERE site_id = $1 AND is_current`, [site.id]);
    expect((await promoteCandidate(db, c2)).reasons.join(" ")).toContain("overdue");
  });

  test("a changed record in a table that is not versioned is deferred rather than overwritten", async () => {
    const [pub] = await db.query(`SELECT code, kind_id FROM source.publishers LIMIT 1`);
    const c = await candidate("source.publishers", { code: pub.code, name: "A different name", kindId: pub.kind_id }, ["code"]);
    await approve(c);
    const result = await promoteCandidate(db, c);
    expect(result.outcome).toBe("deferred");
    expect(result.reasons.join(" ")).toContain("not versioned");
    expect((await db.query(`SELECT name FROM source.publishers WHERE code = $1`, [pub.code]))[0].name).not.toBe("A different name");
  });

  test("an unchanged re-import adds an attribution and creates no new record", async () => {
    const existing = (await db.query(`SELECT id, geometry FROM geography.boundaries WHERE unit_id = $1 AND is_current`, [ids["ke/nairobi"]]))[0];
    const before = (await db.query(`SELECT count(*)::int AS n FROM geography.boundaries`))[0].n;
    const [cap] = await db.query(`INSERT INTO source.captures (document_id, retrieved_at, created_at, updated_at, version) VALUES ($1, now(), now(), now(), 1) RETURNING id`, [documentId]);
    const [r] = await db.query(`INSERT INTO staging.runs (dataset, mapping_version, capture_id, status) VALUES ('again', 'v1', $1, 'completed') RETURNING id`, [cap.id]);
    const c = await candidate("geography.boundaries", { unitId: ref("ke/nairobi"), geometry: existing.geometry }, ["unitId"], { run: r.id });
    await approve(c);
    const result = await promoteCandidate(db, c);
    expect(result).toMatchObject({ outcome: "promoted", targetId: existing.id });
    expect((await db.query(`SELECT count(*)::int AS n FROM geography.boundaries`))[0].n).toBe(before);
    expect((await db.query(`SELECT count(*)::int AS n FROM source.attributions WHERE target_id = $1`, [existing.id]))[0].n).toBe(2);
  });
});
