/**
 * Focused checks of the small auth schema in mzizi_new (DEC-CLEAN-REWRITE-MZIZI-NEW).
 *   cd source/backend/engine/database && bun src/rewrite.ts reset && bun test test/rewrite-auth.test.ts
 * Each test runs in a transaction that is rolled back. Stand-in data tables (geography, electoral, budgets) are
 * created inside that transaction in a throwaway schema, so nothing is left behind.
 */
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from "bun:test";
import pg from "pg";

import { assertRewriteConnection, initRewrite, rewriteMigrationFiles } from "../src/rewrite.ts";
import { rewriteTargetUrl } from "../src/config.ts";

let db: pg.Client;
beforeAll(async () => {
  await initRewrite();
  db = new pg.Client({ connectionString: rewriteTargetUrl().url });
  await db.connect();
  await assertRewriteConnection(db);
});
afterAll(async () => db.end());
beforeEach(async () => db.query("BEGIN"));
afterEach(async () => db.query("ROLLBACK"));

const q = async <T = any>(sql: string, params: unknown[] = []): Promise<T[]> => (await db.query(sql, params)).rows as T[];
const one = async <T = any>(sql: string, params: unknown[] = []): Promise<T> => (await q<T>(sql, params))[0] as T;
async function rejected(sql: string, params: unknown[] = []): Promise<{ code?: string; message: string }> {
  await db.query("SAVEPOINT attempt");
  try {
    await db.query(sql, params);
  } catch (error) {
    await db.query("ROLLBACK TO attempt");
    return error as { code?: string; message: string };
  }
  await db.query("ROLLBACK TO attempt");
  throw new Error(`expected the statement to be rejected: ${sql}`);
}

const ISSUER = "https://sso.example.test/realms/mzizi";
const account = async (name: string, subject?: string): Promise<string> => {
  const id = (await one(`INSERT INTO auth.accounts (display_name) VALUES ($1) RETURNING id`, [name])).id;
  if (subject) await q(`INSERT INTO auth.identities (account_id, issuer, subject) VALUES ($1, $2, $3)`, [id, ISSUER, subject]);
  return id;
};
const institution = async (code: string, parent: string | null = null): Promise<string> =>
  (await one(`INSERT INTO auth.institutions (code, name, parent_id, country_code) VALUES ($1, $1, $2, 'KE') RETURNING id`, [code, parent])).id;
const grant = async (grantor: string, to: string, role: string, table: string | null = null, id: string | null = null, expires: string | null = null): Promise<string> =>
  (await one(`SELECT auth.grant_role($1, $2, $3, $4, $5, $6) AS id`, [grantor, to, role, table, id, expires])).id;
const decide = async (acct: string, permission: string, table: string, record: string): Promise<any> =>
  (await one(`SELECT auth.can($1, $2, $3, $4) AS r`, [acct, permission, table, record])).r;

/** admin + institutions + stand-in data tables:
 *  geo.units (tree: kenya > nairobi, kisumu), geo.budgets linked to units, geo.results linked to institutions (IEBC owns). */
async function world() {
  const admin = (await one(`SELECT auth.bootstrap_admin($1, 'admin-sub', 'Admin') AS id`, [ISSUER])).id;
  const iebc = await institution("iebc");
  const nairobiGov = await institution("nairobi-county");
  const nairobiHealth = await institution("nairobi-health", nairobiGov);
  await q(`CREATE SCHEMA geo`);
  await q(`CREATE TABLE geo.units (id uuid PRIMARY KEY DEFAULT uuidv7(), name text, parent_id uuid REFERENCES geo.units(id))`);
  const kenya = (await one(`INSERT INTO geo.units (name) VALUES ('kenya') RETURNING id`)).id;
  const nairobi = (await one(`INSERT INTO geo.units (name, parent_id) VALUES ('nairobi', $1) RETURNING id`, [kenya])).id;
  const westlands = (await one(`INSERT INTO geo.units (name, parent_id) VALUES ('westlands', $1) RETURNING id`, [nairobi])).id;
  const kisumu = (await one(`INSERT INTO geo.units (name, parent_id) VALUES ('kisumu', $1) RETURNING id`, [kenya])).id;
  await q(`CREATE TABLE geo.budgets (id uuid PRIMARY KEY DEFAULT uuidv7(), unit_id uuid NOT NULL REFERENCES geo.units(id))`);
  await q(`CREATE TABLE geo.results (id uuid PRIMARY KEY DEFAULT uuidv7(), steward_id uuid NOT NULL REFERENCES auth.institutions(id), unit_id uuid REFERENCES geo.units(id))`);
  await q(`SELECT auth.register_scope_target('geo.units', 'parent_id')`);
  await q(`SELECT auth.register_governed_table('geo.budgets', 'finance', 'geo.units', 'unit_id')`);
  await q(`SELECT auth.register_governed_table('geo.results', 'electoral', 'auth.institutions', 'steward_id')`);
  await q(`SELECT auth.create_role('finance_manager', 'Finance manager', ARRAY['finance.*'])`);
  await q(`SELECT auth.create_role('electoral_manager', 'Electoral manager', ARRAY['electoral.*'])`);
  const budget = async (unit: string) => (await one(`INSERT INTO geo.budgets (unit_id) VALUES ($1) RETURNING id`, [unit])).id;
  const result = async (steward: string, unit: string | null = null) => (await one(`INSERT INTO geo.results (steward_id, unit_id) VALUES ($1, $2) RETURNING id`, [steward, unit])).id;
  return { admin, iebc, nairobiGov, nairobiHealth, kenya, nairobi, westlands, kisumu, budget, result };
}

describe("fresh initialization and keys", () => {
  test("migrations are recorded and re-running applies nothing", async () => {
    expect((await q(`SELECT name FROM public.migrations ORDER BY name`)).map((r) => r.name)).toEqual(rewriteMigrationFiles().map((m) => m.name));
    expect(await initRewrite()).toEqual([]);
  });
  test("exactly the nine auth tables exist and public holds only migrations", async () => {
    expect((await q(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'auth' AND table_type = 'BASE TABLE' ORDER BY 1`)).map((r) => r.table_name)).toEqual(
      ["accounts", "governed_tables", "identities", "institutions", "permissions", "role_assignments", "role_permissions", "roles", "scope_targets"]);
    expect((await q(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`)).map((r) => r.table_name)).toEqual(["migrations"]);
  });
  test("every table has a primary key and a comment on the table", async () => {
    expect(await q(`SELECT c.relname FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace AND n.nspname = 'auth' WHERE c.relkind = 'r'
      AND (obj_description(c.oid) IS NULL AND c.relname <> 'role_permissions' OR NOT EXISTS (SELECT 1 FROM pg_constraint k WHERE k.conrelid = c.oid AND k.contype = 'p'))`)).toHaveLength(0);
  });
  test("namespaces create fixed permissions and the admin role holds them all", async () => {
    expect((await one(`SELECT count(*)::int AS n FROM auth.permissions WHERE namespace = 'electoral'`)).n).toBe(6);
    expect((await one(`SELECT count(*)::int AS n FROM auth.role_permissions rp JOIN auth.roles r ON r.id = rp.role_id WHERE r.code = 'admin'`)).n).toBe(60);
    expect((await rejected(`INSERT INTO auth.permissions VALUES ('electoral', 'approve')`)).code).toBe("23514");
    await q(`SELECT auth.register_namespace('newarea')`);
    expect((await one(`SELECT count(*)::int AS n FROM auth.role_permissions rp JOIN auth.roles r ON r.id = rp.role_id WHERE r.code = 'admin' AND namespace = 'newarea'`)).n).toBe(6);
  });
  test("foreign keys, uniqueness and scope pairing are enforced", async () => {
    await world();
    const a = await account("A", "same");
    expect((await rejected(`INSERT INTO auth.identities (account_id, issuer, subject) VALUES ($1, $2, 'same')`, [a, ISSUER])).code).toBe("23505");
    expect((await rejected(`INSERT INTO auth.role_permissions VALUES (uuidv7(), 'electoral', 'read')`)).code).toBe("23503");
    expect((await rejected(`INSERT INTO auth.role_assignments (account_id, role_id, scope_table, granted_by) SELECT $1, id, 'geo.units', $1 FROM auth.roles WHERE code = 'reader'`, [a])).code).toBe("23514");
    expect((await rejected(`INSERT INTO auth.institutions (code, name, country_code) VALUES ('x', 'x', 'kenya')`)).code).toMatch(/^(22001|23514)$/);
  });
});

describe("OIDC identity", () => {
  test("opaque non-UUID subjects resolve; unknown and suspended are distinguished", async () => {
    await world();
    for (const s of ["auth0|65f1c3", "kc:7b/x y", "plain"]) await account(`u ${s}`, s);
    for (const s of ["auth0|65f1c3", "kc:7b/x y", "plain"]) expect((await one(`SELECT outcome FROM auth.resolve_identity($1, $2)`, [ISSUER, s])).outcome).toBe("ok");
    expect((await one(`SELECT outcome FROM auth.resolve_identity($1, 'nobody')`, [ISSUER])).outcome).toBe("unknown_identity");
    expect((await one(`SELECT outcome FROM auth.resolve_identity('https://other.example', 'plain')`)).outcome).toBe("unknown_identity");
    await q(`UPDATE auth.accounts SET status = 'suspended' WHERE display_name = 'u plain'`);
    expect((await one(`SELECT outcome FROM auth.resolve_identity($1, 'plain')`, [ISSUER])).outcome).toBe("account_not_active");
  });
});

describe("scoped access", () => {
  test("IEBC official edits IEBC results; a Nairobi jurisdiction manager cannot, even for Nairobi results", async () => {
    const w = await world();
    const iebcOfficial = await account("IEBC official");
    const countyOfficial = await account("Nairobi official");
    await grant(w.admin, iebcOfficial, "electoral_manager", "auth.institutions", w.iebc);
    await grant(w.admin, countyOfficial, "electoral_manager", "geo.units", w.nairobi);
    const iebcResult = await w.result(w.iebc, w.nairobi);
    expect((await decide(iebcOfficial, "electoral.edit", "geo.results", iebcResult)).allowed).toBe(true);
    const denied = await decide(countyOfficial, "electoral.edit", "geo.results", iebcResult);
    expect(denied.allowed).toBe(false);
    expect(denied.reason).toBe("out_of_scope");
  });
  test("a grant on a parent covers its children but not siblings or the parent's parent", async () => {
    const w = await world();
    const manager = await account("Nairobi finance");
    await grant(w.admin, manager, "finance_manager", "geo.units", w.nairobi);
    expect((await decide(manager, "finance.edit", "geo.budgets", await w.budget(w.nairobi))).allowed).toBe(true);
    expect((await decide(manager, "finance.edit", "geo.budgets", await w.budget(w.westlands))).allowed).toBe(true);
    expect((await decide(manager, "finance.edit", "geo.budgets", await w.budget(w.kisumu))).reason).toBe("out_of_scope");
    expect((await decide(manager, "finance.edit", "geo.budgets", await w.budget(w.kenya))).reason).toBe("out_of_scope");
  });
  test("institution grants cover departments", async () => {
    const w = await world();
    const official = await account("County official");
    await grant(w.admin, official, "electoral_manager", "auth.institutions", w.nairobiGov);
    expect((await decide(official, "electoral.read", "geo.results", await w.result(w.nairobiHealth))).allowed).toBe(true);
    expect((await decide(official, "electoral.read", "geo.results", await w.result(w.iebc))).allowed).toBe(false);
  });
  test("a role grants only its own namespace and actions", async () => {
    const w = await world();
    const manager = await account("Finance manager");
    await grant(w.admin, manager, "finance_manager", "geo.units", w.kenya);
    expect((await decide(manager, "finance.publish", "geo.budgets", await w.budget(w.kisumu))).allowed).toBe(true);
    expect((await decide(manager, "electoral.edit", "geo.budgets", await w.budget(w.kisumu))).reason).toBe("namespace_mismatch");
    const reader = await account("Reader");
    await grant(w.admin, reader, "reader");
    expect((await decide(reader, "finance.read", "geo.budgets", await w.budget(w.kisumu))).allowed).toBe(true);
    expect((await decide(reader, "finance.edit", "geo.budgets", await w.budget(w.kisumu))).reason).toBe("no_grant");
  });
  test("platform-wide grants cover every record of a governed table; unregistered tables are denied", async () => {
    const w = await world();
    const reviewer = await account("Platform manager");
    await grant(w.admin, reviewer, "finance_manager");
    expect((await decide(reviewer, "finance.edit", "geo.budgets", await w.budget(w.kisumu))).allowed).toBe(true);
    await q(`CREATE TABLE geo.unregistered (id uuid PRIMARY KEY DEFAULT uuidv7())`);
    const id = (await one(`INSERT INTO geo.unregistered DEFAULT VALUES RETURNING id`)).id;
    expect((await decide(w.admin, "finance.edit", "geo.unregistered", id)).reason).toBe("table_not_governed");
  });
  test("expiry, revocation and suspension deny immediately", async () => {
    const w = await world();
    const budget = await w.budget(w.kisumu);
    const timed = await account("Timed");
    await grant(w.admin, timed, "finance_manager", "geo.units", w.kenya, new Date(Date.now() + 3600_000).toISOString());
    expect((await decide(timed, "finance.edit", "geo.budgets", budget)).allowed).toBe(true);
    await q(`UPDATE auth.role_assignments SET expires_at = now() - interval '1 second' WHERE account_id = $1`, [timed]);
    expect((await decide(timed, "finance.edit", "geo.budgets", budget)).reason).toBe("no_grant");
    const revoked = await account("Revoked");
    const g = await grant(w.admin, revoked, "finance_manager", "geo.units", w.kenya);
    await q(`SELECT auth.revoke_grant($1, $2)`, [w.admin, g]);
    expect((await decide(revoked, "finance.edit", "geo.budgets", budget)).reason).toBe("no_grant");
    const suspended = await account("Suspended");
    await grant(w.admin, suspended, "finance_manager", "geo.units", w.kenya);
    await q(`UPDATE auth.accounts SET status = 'suspended' WHERE id = $1`, [suspended]);
    expect((await decide(suspended, "finance.edit", "geo.budgets", budget)).reason).toBe("account_not_active");
  });
});

describe("grants and ownership changes", () => {
  test("only an account with platform auth.edit grants or revokes", async () => {
    const w = await world();
    const nobody = await account("Nobody");
    const friend = await account("Friend");
    expect((await rejected(`SELECT auth.grant_role($1, $2, 'reader')`, [nobody, friend])).message).toContain("may not grant");
    const reviewer = await account("Reviewer");
    await grant(w.admin, reviewer, "reviewer");
    expect((await rejected(`SELECT auth.grant_role($1, $2, 'reader')`, [reviewer, friend])).message).toContain("may not grant");
    const g = await grant(w.admin, friend, "reader");
    expect((await rejected(`SELECT auth.revoke_grant($1, $2)`, [nobody, g])).message).toContain("may not revoke");
  });
  test("a grant to a nonexistent or unregistered scope is rejected, and grants cannot be edited, extended or deleted", async () => {
    const w = await world();
    const user = await account("User");
    expect((await rejected(`SELECT auth.grant_role($1, $2, 'reader', 'geo.units', uuidv7())`, [w.admin, user])).message).toContain("does not exist");
    expect((await rejected(`SELECT auth.grant_role($1, $2, 'reader', 'geo.budgets', uuidv7())`, [w.admin, user])).message).toContain("not an allowed scope target");
    const g = await grant(w.admin, user, "reader", "geo.units", w.nairobi, new Date(Date.now() + 3600_000).toISOString());
    expect((await rejected(`UPDATE auth.role_assignments SET expires_at = expires_at + interval '1 day' WHERE id = $1`, [g])).message).toContain("cannot be extended");
    expect((await rejected(`UPDATE auth.role_assignments SET role_id = (SELECT id FROM auth.roles WHERE code = 'admin') WHERE id = $1`, [g])).message).toContain("cannot be edited");
    expect((await rejected(`DELETE FROM auth.role_assignments WHERE id = $1`, [g])).message).toContain("never deleted");
  });
  test("registration needs real tables and columns", async () => {
    await world();
    expect((await rejected(`SELECT auth.register_scope_target('geo.missing')`)).message).toContain("does not exist");
    expect((await rejected(`SELECT auth.register_governed_table('geo.budgets', 'nonamespace', 'geo.units', 'unit_id')`)).message).toContain("not registered");
    await q(`CREATE TABLE geo.other (id uuid PRIMARY KEY)`);
    expect((await rejected(`SELECT auth.register_governed_table('geo.other', 'finance', 'geo.units', 'unit_id')`)).message).toContain("not found");
  });
  test("moving a record's owner is checked against both the existing and the proposed owner", async () => {
    const w = await world();
    const manager = await account("Nairobi finance");
    await grant(w.admin, manager, "finance_manager", "geo.units", w.nairobi);
    const budget = await w.budget(w.westlands);
    const change = async (to: string) => (await one(`SELECT auth.can_change($1, 'finance.edit', 'geo.budgets', $2, $3) AS r`, [manager, budget, to])).r;
    expect((await change(w.nairobi)).allowed).toBe(true);
    expect((await change(w.kisumu)).failed_on).toBe("proposed_owner");
    const outside = await w.budget(w.kisumu);
    expect((await one(`SELECT auth.can_change($1, 'finance.edit', 'geo.budgets', $2, $3) AS r`, [manager, outside, w.nairobi])).r.failed_on).toBe("existing_owner");
  });
  test("institution parents cannot form a cycle", async () => {
    const w = await world();
    expect((await rejected(`UPDATE auth.institutions SET parent_id = $1 WHERE id = $2`, [w.nairobiHealth, w.nairobiGov])).message).toContain("cycle");
  });
});

describe("listing", () => {
  test("allowed_links filters before pagination and totals", async () => {
    const w = await world();
    const manager = await account("Lister");
    await grant(w.admin, manager, "finance_manager", "geo.units", w.nairobi);
    const units = [w.nairobi, w.kisumu, w.westlands, w.kenya, w.kisumu, w.nairobi, w.kisumu, w.westlands];
    const ids: string[] = [];
    for (const u of units) ids.push(await w.budget(u));
    const visible = `FROM geo.budgets b WHERE EXISTS (SELECT 1 FROM auth.allowed_links($1, 'finance.read', 'geo.budgets') l WHERE l.all_records OR l.link_id = b.unit_id)`;
    expect((await one(`SELECT count(*)::int AS n ${visible}`, [manager])).n).toBe(4);
    const page = await q(`SELECT b.id ${visible} ORDER BY b.id LIMIT 3 OFFSET 2`, [manager]);
    expect(page).toHaveLength(2);
    const allowed = new Set([ids[0], ids[2], ids[5], ids[7]]);
    for (const row of page) expect(allowed.has(row.id)).toBe(true);
    expect((await one(`SELECT count(*)::int AS n FROM auth.allowed_links($1, 'finance.read', 'geo.budgets') WHERE all_records`, [w.admin])).n).toBe(1);
    expect(await q(`SELECT 1 FROM auth.allowed_links($1, 'electoral.read', 'geo.budgets')`, [manager])).toHaveLength(0);
  });
});
