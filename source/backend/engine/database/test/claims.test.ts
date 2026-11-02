import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { Client } from "pg";

import { checkClaim, promoteClaims, reviewClaims } from "../src/claims.ts";
import { openDataSource, withDatabase } from "../src/config.ts";
import { migrate } from "../src/migrations.ts";
import { seedFixtures, seedReference } from "../src/seeds.ts";

const adminUrl = process.env.TEST_DATABASE_URL;
const run = adminUrl ? describe : describe.skip;
const scratch = `${process.env.TEST_SCRATCH_DB ?? "mzizi_test"}_claims`;

run("claim review and promotion", () => {
  let db: Awaited<ReturnType<typeof openDataSource>>;
  let reviewer: string;
  let nobody: string;
  let unit: string;

  async function account(role: string): Promise<string> {
    const [a] = await db.query(`INSERT INTO identity.accounts (issuer, subject, status, created_at, updated_at, version) VALUES ('test', $1, 'active', now(), now(), 1) RETURNING id`, [randomUUID()]);
    await db.query(`INSERT INTO identity.grants (account_id, role, is_current, created_at, updated_at, version) VALUES ($1, $2, true, now(), now(), 1)`, [a.id, role]);
    return a.id;
  }

  /** A claim plus the standing the data engine would derive: the given winner among the claims for the field. */
  async function claim(target: string, field: string, value: unknown, trust = 0.8, kind = "geography.units"): Promise<string> {
    const [c] = await db.query(
      `INSERT INTO engine.claims (target_kind, target_id, field, value, value_hash, attribution_id, trust) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [kind, target, field, JSON.stringify(value), randomUUID().replace(/-/g, "").padEnd(64, "0"), randomUUID(), trust],
    );
    return c.id;
  }
  async function standing(target: string, field: string, winner: string, disputed = false, kind = "geography.units") {
    await db.query(
      `INSERT INTO engine.claim_standings (target_kind, target_id, field, winning_claim_id, corroboration, disputed, distinct_values, why) VALUES ($1, $2, $3, $4, 1, $5, $6, 'test')
       ON CONFLICT (target_kind, target_id, field) DO UPDATE SET winning_claim_id = $4, disputed = $5`,
      [kind, target, field, winner, disputed, disputed ? 2 : 1],
    );
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
    nobody = await account("contributor");
    unit = (await db.query(`SELECT id FROM geography.units WHERE code = 'ke/nairobi'`))[0].id;
  }, 180_000);

  afterAll(async () => {
    await db?.destroy();
  });

  test("field rules: only promotable fields with a valid value", () => {
    expect(checkClaim({ target_kind: "geography.units", field: "wikidata_id", value: "Q170" })).toBeNull();
    expect(checkClaim({ target_kind: "geography.units", field: "wikidata_id", value: "Nairobi" })).toContain("not a Wikidata item");
    expect(checkClaim({ target_kind: "geography.units", field: "flag_marker", value: "unknown" })).toContain("not a decided marker");
    expect(checkClaim({ target_kind: "geography.units", field: "name", value: "x" })).toContain("not a promotable field");
  });

  test("only an account that may decide reviews, and it must give a rationale", async () => {
    await expect(reviewClaims(db, nobody, "r")).rejects.toThrow("review.decide");
    await expect(reviewClaims(db, reviewer, " ")).rejects.toThrow("rationale");
  });

  test("an undisputed winner is accepted with an audit decision, then fills the unset column", async () => {
    const id = await claim(unit, "wikidata_id", "Q170");
    await standing(unit, "wikidata_id", id);
    const tally = await reviewClaims(db, reviewer, "Wikidata item matched on label, country and instance; checked.", { fields: ["wikidata_id"] });
    expect(tally.accepted).toBe(1);
    const [decision] = await db.query(`SELECT decision, rationale, reviewer_id FROM audit.decisions WHERE target_kind = 'engine.claims' AND target_id = $1`, [id]);
    expect(decision.decision).toBe("approve");
    expect(decision.reviewer_id).toBe(reviewer);
    const promoted = await promoteClaims(db);
    expect(promoted.promoted).toBe(1);
    expect((await db.query(`SELECT wikidata_id FROM geography.units WHERE id = $1`, [unit]))[0].wikidata_id).toBe("Q170");
    expect((await db.query(`SELECT promoted_at FROM engine.claims WHERE id = $1`, [id]))[0].promoted_at).not.toBeNull();
    expect((await promoteClaims(db)).promoted).toBe(0); // idempotent
  });

  test("a disputed field and an outranked claim are left for a reviewer; an invalid claim is rejected", async () => {
    const [{ id: other }] = await db.query(`SELECT id FROM geography.units WHERE code = 'ke'`);
    const a = await claim(other, "flag_marker", "has", 0.9);
    const b = await claim(other, "flag_marker", "none", 0.6);
    await standing(other, "flag_marker", a, true);
    const bad = await claim(other, "emblem_marker", "maybe");
    await standing(other, "emblem_marker", bad);
    const tally = await reviewClaims(db, reviewer, "Automatic pass.");
    expect(tally).toEqual({ accepted: 0, rejected: 1, left: 2 });
    expect((await db.query(`SELECT review FROM engine.claims WHERE id = ANY($1)`, [[a, b]])).map((r: { review: string }) => r.review)).toEqual(["proposed", "proposed"]);
    expect((await db.query(`SELECT review, review_rationale FROM engine.claims WHERE id = $1`, [bad]))[0].review).toBe("rejected");
    expect((await db.query(`SELECT 1 FROM engine.claim_standings WHERE winning_claim_id = $1`, [bad])).length).toBe(0);
  });

  test("a different existing value is never overwritten: the conflict is reported and the claim stays unpromoted", async () => {
    const [{ id: other }] = await db.query(`SELECT id FROM geography.units WHERE code = 'ke'`);
    await db.query(`UPDATE geography.units SET flag_marker = 'none' WHERE id = $1`, [other]);
    const [claimRow] = await db.query(`SELECT id FROM engine.claims WHERE target_id = $1 AND field = 'flag_marker' AND value = '"has"'`, [other]);
    await standing(other, "flag_marker", claimRow.id, false);
    await reviewClaims(db, reviewer, "Resolved the dispute in favour of the higher-trust source.", { fields: ["flag_marker"] });
    const tally = await promoteClaims(db);
    expect(tally.promoted).toBe(0);
    expect(tally.conflicts).toEqual([{ claimId: claimRow.id, kind: "geography.units", field: "flag_marker", existing: "none", claimed: "has" }]);
    expect((await db.query(`SELECT flag_marker FROM geography.units WHERE id = $1`, [other]))[0].flag_marker).toBe("none");
  });

  test("an unknown marker is filled, and a three-state marker keeps `none` distinct from `unknown`", async () => {
    const [{ id: third }] = await db.query(`SELECT id FROM geography.units WHERE code = 'ke/nairobi'`);
    await db.query(`UPDATE geography.units SET emblem_marker = 'unknown' WHERE id = $1`, [third]);
    const id = await claim(third, "emblem_marker", "has");
    await standing(third, "emblem_marker", id);
    await reviewClaims(db, reviewer, "Emblem is on Wikidata.", { fields: ["emblem_marker"] });
    expect((await promoteClaims(db)).promoted).toBe(1);
    expect((await db.query(`SELECT emblem_marker FROM geography.units WHERE id = $1`, [third]))[0].emblem_marker).toBe("has");
  });
});
