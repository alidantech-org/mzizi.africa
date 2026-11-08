import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { Client } from "pg";

import { openDataSource, withDatabase } from "../src/config.ts";
import { migrate } from "../src/migrations.ts";
import { seedReference } from "../src/seeds.ts";

const adminUrl = process.env.TEST_DATABASE_URL;
const run = adminUrl ? describe : describe.skip;
const scratch = `${process.env.TEST_SCRATCH_DB ?? "mzizi_test"}_electoral`;

run("electoral schema: electorate, referendum, list seats, revised results", () => {
  let db: Awaited<ReturnType<typeof openDataSource>>;
  let election: string;
  let level: string;
  const id = () => crypto.randomUUID();
  const base = `created_at, updated_at, is_current, version`;
  const baseVals = `now(), now(), true, 1`;

  beforeAll(async () => {
    const admin = new Client({ connectionString: withDatabase(adminUrl as string, "postgres") });
    await admin.connect();
    await admin.query(`DROP DATABASE IF EXISTS ${scratch} WITH (FORCE)`);
    await admin.query(`CREATE DATABASE ${scratch}`);
    await admin.end();
    process.env.DATABASE_URL = withDatabase(adminUrl as string, scratch);
    await migrate();
    db = await openDataSource(process.env.DATABASE_URL);
    await seedReference(db);
    const [j] = await db.query(`SELECT id FROM reference.jurisdictions WHERE code = 'ke'`);
    const [t] = await db.query(`SELECT id FROM reference.classifications WHERE code = 'elections/election-type/general'`);
    level = (await db.query(`SELECT id FROM reference.classifications WHERE code = 'elections/result-level/constituency'`))[0].id;
    [{ id: election }] = await db.query(`INSERT INTO electoral.elections (code, name, jurisdiction_id, type_id, status, ${base}) VALUES ('ke/test/2022', 'Test 2022', $1, $2, 'completed', ${baseVals}) RETURNING id`, [j.id, t.id]);
  }, 180_000);

  afterAll(async () => {
    await db?.destroy();
  });

  test("an electorate row holds registered, cast, valid, rejected and spoilt with the register version", async () => {
    const [row] = await db.query(
      `INSERT INTO electoral.electorates (election_id, result_level_id, register_version, registered_voters, votes_cast, valid_votes, rejected_votes, spoilt_votes, result_status, evidence_form, ${base}) VALUES ($1, $2, 'register 2022', 1000, 800, 780, 15, 5, 'declared', 'Form 34B', ${baseVals}) RETURNING valid_votes + rejected_votes + spoilt_votes AS ballots, votes_cast`,
      [election, level],
    );
    expect(Number(row.ballots)).toBe(Number(row.votes_cast));
  });

  test("a referendum question has options and a result per option", async () => {
    const [q] = await db.query(`INSERT INTO electoral.referendum_questions (election_id, code, text, ${base}) VALUES ($1, 'q1', 'Approve the proposed constitution?', ${baseVals}) RETURNING id`, [election]);
    const [yes] = await db.query(`INSERT INTO electoral.referendum_options (question_id, code, label, ${base}) VALUES ($1, 'yes', 'Yes', ${baseVals}) RETURNING id`, [q.id]);
    const [r] = await db.query(`INSERT INTO electoral.referendum_results (option_id, result_level_id, votes, ${base}) VALUES ($1, $2, 6092593, ${baseVals}) RETURNING votes`, [yes.id, level]);
    expect(Number(r.votes)).toBe(6092593);
    await expect(db.query(`INSERT INTO electoral.referendum_options (question_id, code, label, ${base}) VALUES ($1, 'yes', 'Yes again', ${baseVals})`, [q.id])).rejects.toThrow();
  });

  test("a list seat allocation links a party and, later, a person", async () => {
    const [a] = await db.query(`INSERT INTO electoral.seat_allocations (election_id, party_id, kind, list_position, ${base}) VALUES ($1, $2, 'women_special', 1, ${baseVals}) RETURNING kind`, [election, id()]);
    expect(a.kind).toBe("women_special");
  });

  test("a revised count is a new version and the old row stays as history", async () => {
    const geo = id();
    const [first] = await db.query(`INSERT INTO electoral.electorates (election_id, geo_unit_id, result_level_id, registered_voters, votes_cast, result_status, ${base}) VALUES ($1, $2, $3, 1000, 800, 'declared', ${baseVals}) RETURNING id`, [election, geo, level]);
    await db.query(`UPDATE electoral.electorates SET is_current = false, valid_to = current_date WHERE id = $1`, [first.id]);
    await db.query(`INSERT INTO electoral.electorates (election_id, geo_unit_id, result_level_id, registered_voters, votes_cast, result_status, ${base}) VALUES ($1, $2, $3, 1000, 790, 'revised', ${baseVals})`, [election, geo, level]);
    const rows = await db.query(`SELECT votes_cast, is_current FROM electoral.electorates WHERE geo_unit_id = $1 ORDER BY votes_cast DESC`, [geo]);
    expect(rows.map((r: { is_current: boolean }) => r.is_current)).toEqual([false, true]);
  });
});
