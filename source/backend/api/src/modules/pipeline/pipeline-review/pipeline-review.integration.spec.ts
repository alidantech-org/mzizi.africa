import "reflect-metadata";

import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { Client } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { scratchDatabase } from "#/database/scratch-database";
import { setReviewerDataSource } from "#/database/reviewer-database";
import { FindCandidatesUseCase } from "#/modules/pipeline/pipeline-review/use-cases/find-candidates.usecase";
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
    const url = await scratchDatabase(adminUrl as string, "mzizi_pipeline_test");
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
});
