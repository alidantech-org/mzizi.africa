import "reflect-metadata";

import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { Client } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { scratchDatabase } from "#/database/scratch-database";
import { setReviewerDataSource } from "#/database/reviewer-database";
import { FindCandidatesUseCase } from "#/modules/pipeline/pipeline-review/use-cases/find-candidates.usecase";
import { DraftAssessmentUseCase } from "#/modules/pipeline/pipeline-review/use-cases/draft-assessment.usecase";
import { FindCapturesUseCase } from "#/modules/pipeline/pipeline-review/use-cases/find-captures.usecase";
import { FindChecksUseCase } from "#/modules/pipeline/pipeline-review/use-cases/find-checks.usecase";
import { FindDocumentsUseCase } from "#/modules/pipeline/pipeline-review/use-cases/find-documents.usecase";
import { FindStructureVersionsUseCase } from "#/modules/pipeline/pipeline-review/use-cases/find-structure-versions.usecase";
import { runAsActor } from "#/auth/actor-context";
import { FindJobsUseCase } from "#/modules/pipeline/pipeline-review/use-cases/find-jobs.usecase";
import { FindRunsUseCase } from "#/modules/pipeline/pipeline-review/use-cases/find-runs.usecase";
import { FindSitesUseCase } from "#/modules/pipeline/pipeline-review/use-cases/find-sites.usecase";
import { GetCandidateDetailUseCase } from "#/modules/pipeline/pipeline-review/use-cases/get-candidate-detail.usecase";

/**
 * Reviewer read models on a real database built by the database engine's own migrations (the staging,
 * engine and registry tables are engine-owned), read through the read-only reviewer role.
 */
const adminUrl = process.env.TEST_DATABASE_URL;
const ROLE = "mzizi_reviewer_test";
const engine = join(process.cwd(), "..", "engine", "database");

describe.skipIf(!adminUrl)("pipeline reviewer reads (PostgreSQL)", () => {
  let client: Client;
  let candidateId: string;
  let runId: string;

  beforeAll(async () => {
    const url = await scratchDatabase(adminUrl as string, "mzizi_test");
    const env = { ...process.env, DATABASE_URL: url };
    execFileSync("bun", ["src/cli.ts", "migrate"], { cwd: engine, env, stdio: "pipe" });
    client = new Client({ connectionString: url });
    await client.connect();
    await client.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '${ROLE}') THEN CREATE ROLE ${ROLE} LOGIN PASSWORD 'x'; END IF; END $$`);
    execFileSync("bun", ["src/cli.ts", "grants-reviewer", ROLE], { cwd: engine, env, stdio: "pipe" });
    const [run] = (await client.query(`INSERT INTO staging.runs (dataset, mapping_version, status) VALUES ('test-set', 'v1', 'completed') RETURNING id`)).rows;
    runId = run.id;
    const [candidate] = (
      await client.query(
        `INSERT INTO staging.candidates (run_id, target_kind, natural_key_hash, payload_hash, payload, extraction_result_id, method, confidence, status)
         VALUES ($1, 'finance.budgets', repeat('a', 64), repeat('b', 64), '{"amount": 12}', gen_random_uuid(), 'extracted', 0.9, 'in_review') RETURNING id`,
        [runId],
      )
    ).rows;
    candidateId = candidate.id;
    await client.query(`INSERT INTO staging.issues (candidate_id, rule, severity, message) VALUES ($1, 'unit', 'warning', 'unit assumed')`, [candidateId]);
    await client.query(`INSERT INTO engine.jobs (kind, input_hash, input) VALUES ('probe', repeat('c', 64), '{}')`);
    process.env.DATABASE_PROMOTE_URL = url;
    process.env.ENGINE_DATABASE_DIR = engine;
    const reviewer = new URL(url);
    reviewer.username = ROLE;
    reviewer.password = "x";
    process.env.DATABASE_REVIEWER_URL = reviewer.toString();
    setReviewerDataSource(undefined);
  }, 120_000);

  afterAll(async () => {
    setReviewerDataSource(undefined);
    await client?.end();
  });

  it("lists candidates with issue counts and filters by status", async () => {
    const all = await new FindCandidatesUseCase().execute({} as never);
    expect(all.candidates.map((c) => c.id)).toContain(candidateId);
    expect(all.candidates.find((c) => c.id === candidateId)?.issueCount).toBe(1);
    const none = await new FindCandidatesUseCase().execute({ status: "promoted" } as never);
    expect(none.candidates).toHaveLength(0);
  });

  it("returns payload, issues and lineage for a candidate", async () => {
    const detail = await new GetCandidateDetailUseCase().execute({ candidateId });
    expect(JSON.parse(detail.payload)).toEqual({ amount: 12 });
    expect(detail.issues[0]?.rule).toBe("unit");
    expect(detail.current).toBeNull();
  });

  it("lists runs, jobs and sites, and refuses writes through the reviewer role", async () => {
    expect((await new FindRunsUseCase().execute({} as never)).runs[0]?.candidates).toBe(1);
    expect((await new FindJobsUseCase().execute({} as never)).jobs[0]?.kind).toBe("probe");
    expect((await new FindSitesUseCase().execute({} as never)).sites).toEqual([]);
    const reviewer = new Client({ connectionString: process.env.DATABASE_REVIEWER_URL });
    await reviewer.connect();
    await expect(reviewer.query(`UPDATE staging.candidates SET status = 'approved'`)).rejects.toThrow(/permission denied/);
    await reviewer.end();
  });

  it("lists documents, captures, structure versions and checks", async () => {
    const first = async (type: string) => (await client.query(`SELECT (enum_range(NULL::${type}))[1]::text AS v`)).rows[0].v;
    const [site] = (await client.query(`INSERT INTO website.sites (code, name, kind, status, created_at, updated_at, version) VALUES ('t/site', 'Test site', 'portal', 'expected', now(), now(), 1) RETURNING id`)).rows;
    const [publisher] = (await client.query(`INSERT INTO source.publishers (code, name, kind_id, created_at, updated_at, version) VALUES ('t-pub', 'Test publisher', gen_random_uuid(), now(), now(), 1) RETURNING id`)).rows;
    const [document] = (await client.query(`INSERT INTO source.documents (title, kind_id, publisher_id, url, created_at, updated_at, version) VALUES ('Budget book', gen_random_uuid(), $1, 'https://example.test/b.pdf', now(), now(), 1) RETURNING id`, [publisher.id])).rows;
    await client.query(`INSERT INTO source.captures (document_id, site_id, retrieved_at, http_status, content_hash, tool, created_at, updated_at, version) VALUES ($1, $2, now(), 200, repeat('d', 64), 'fixture', now(), now(), 1)`, [document.id, site.id]);
    const [structure] = (await client.query(`INSERT INTO website.structures (owner_id, owner_kind, purpose, status, created_at, updated_at, version) VALUES ($1, '${await first("website.structures_owner_kind_enum")}', 'extraction', '${await first("website.structures_status_enum")}', now(), now(), 1) RETURNING id`, [site.id])).rows;
    await client.query(`INSERT INTO website.structure_versions (structure_id, number, schema_version, manifest_hash, status, created_at, updated_at, version) VALUES ($1, 1, '1', repeat('e', 64), '${await first("website.structure_versions_status_enum")}', now(), now(), 1)`, [structure.id]);
    await client.query(`INSERT INTO website.checks (site_id, kind, outcome, checked_at, created_at, updated_at, version) VALUES ($1, '${await first("website.checks_kind_enum")}', '${await first("website.checks_outcome_enum")}', now(), now(), now(), 1)`, [site.id]);

    expect((await new FindDocumentsUseCase().execute({} as never)).documents[0]).toMatchObject({ title: "Budget book", publisher: "Test publisher", captures: 1 });
    expect((await new FindCapturesUseCase().execute({} as never)).captures[0]).toMatchObject({ documentTitle: "Budget book", httpStatus: 200 });
    expect((await new FindStructureVersionsUseCase().execute({} as never)).structureVersions[0]).toMatchObject({ purpose: "extraction", number: 1 });
    expect((await new FindChecksUseCase().execute({} as never)).checks[0]).toMatchObject({ siteName: "Test site" });
  });

  it("a reviewer drafts an assessment through the engine; it stays in_review", async () => {
    await client.query(`INSERT INTO identity.accounts (id, issuer, subject, status, created_at, updated_at, version) VALUES ('00000000-0000-4000-8000-0000000000a1', 'mzizi-dev', 'dev-reviewer', 'active', now(), now(), 1) ON CONFLICT DO NOTHING`);
    await client.query(`INSERT INTO identity.grants (account_id, role, is_current, created_at, updated_at, version) VALUES ('00000000-0000-4000-8000-0000000000a1', 'reviewer', true, now(), now(), 1)`);
    const [site] = (await client.query(`SELECT id FROM website.sites WHERE code = 't/site'`)).rows;
    const request = { siteId: site.id, accessBasis: "published_terms", sourceType: "official_website", rightsHolder: "Test publisher", approvedScope: JSON.stringify({ hosts: ["example.test"] }), rationale: "terms read" };
    const result = await runAsActor({ actorId: "00000000-0000-4000-8000-0000000000a1", role: "reviewer" }, () => new DraftAssessmentUseCase().execute(request as never));
    const [row] = (await client.query(`SELECT status::text AS status, is_current, reviewed_by FROM website.assessments WHERE id = $1`, [result.assessmentId])).rows;
    expect(row).toEqual({ status: "in_review", is_current: true, reviewed_by: null });
  }, 60_000);
});
