/** Command implementations. Each opens its own short-lived administrative connection. */
import { SQL } from "bun";
import { APPLICATION_ROLES, adminUrl, paths, TARGET_NAME } from "./config.ts";
import { applied, applyRelease, ensure, reconcile } from "./ledger.ts";
import { assemble as assembleSnapshot, loadReleases } from "./releases.ts";

const LOCK_NAME = "mzizi.migrations";

async function withAdmin<T>(run: (sql: SQL) => Promise<T>): Promise<T> {
  const sql = new SQL(adminUrl());
  try {
    return await run(sql);
  } finally {
    await sql.close();
  }
}

export function assemble(): string {
  const { snapshot, releases } = paths();
  const outcome = assembleSnapshot(snapshot, releases);
  return outcome === "initial" ? `assembled 0001_init.sql for ${TARGET_NAME}` : `release stream for ${TARGET_NAME} is up to date`;
}

export async function status(): Promise<string[]> {
  return await withAdmin(async (sql) => {
    await ensure(sql);
    const ledger = await applied(sql);
    const releases = loadReleases(paths().releases);
    const lines = [`target: ${TARGET_NAME}`, `applied: ${ledger.length}`];
    for (const release of releases) {
      const row = ledger.find((entry) => entry.name === release.name);
      const state = row ? (row.checksum === release.checksum ? "applied" : "CHECKSUM MISMATCH") : "pending";
      lines.push(`  ${release.name.padEnd(30)} ${state}`);
    }
    return lines;
  });
}

export async function plan(): Promise<string[]> {
  return await withAdmin(async (sql) => {
    await ensure(sql);
    const { pending } = reconcile(loadReleases(paths().releases), await applied(sql));
    return [...pending.map((release) => `would apply ${release.name}`), `${pending.length} pending release(s)`];
  });
}

/** Applies pending releases while holding a session advisory lock so concurrent migrators serialize. */
export async function migrate(): Promise<string> {
  return await withAdmin(async (sql) => {
    const lock = await sql.reserve();
    try {
      await lock`SELECT pg_advisory_lock(hashtext(${LOCK_NAME}))`;
      await ensure(sql);
      const { pending } = reconcile(loadReleases(paths().releases), await applied(sql));
      for (const release of pending) await applyRelease(sql, release);
      return pending.length === 0
        ? `migrations up to date for ${TARGET_NAME}`
        : `applied ${pending.length} release(s) to ${TARGET_NAME}`;
    } finally {
      await lock`SELECT pg_advisory_unlock(hashtext(${LOCK_NAME}))`;
      lock.release();
    }
  });
}

export async function verify(): Promise<string> {
  return await withAdmin(async (sql) => {
    await ensure(sql);
    const ledger = await applied(sql);
    reconcile(loadReleases(paths().releases), ledger);
    return `verified ${ledger.length} applied release(s) for ${TARGET_NAME}`;
  });
}

function quoteIdent(name: string): string {
  return `"${name.replaceAll('"', '""')}"`;
}

function quoteLiteral(value: string): string {
  return `'${value.replaceAll("'", "''")}'`;
}

/**
 * Idempotently provisions the application roles. Each role may log in and read and write every domain
 * schema, but cannot run DDL and has no access to the ledger tables in `public`. Passwords come from the
 * environment and are never logged. Roles are cluster-wide; grants are per database.
 */
export async function roles(): Promise<string> {
  return await withAdmin(async (sql) => {
    await ensure(sql);
    const database = (await sql<{ db: string }[]>`SELECT current_database() AS db`)[0]?.db;
    if (!database) throw new Error("cannot determine the current database");
    const schemas = await sql<{ nspname: string }[]>`
      SELECT nspname FROM pg_namespace
      WHERE nspname !~ '^pg_' AND nspname NOT IN ('information_schema', 'public') ORDER BY nspname`;

    for (const { role, passwordEnv } of APPLICATION_ROLES) {
      const password = process.env[passwordEnv];
      if (!password || password.includes("\0")) throw new Error(`${passwordEnv} is required to provision ${role}`);
      const exists = (await sql`SELECT 1 FROM pg_roles WHERE rolname = ${role}`).length > 0;
      const quoted = quoteIdent(role);
      // Restrictive attributes are set only when the role is created: PostgreSQL 16+ refuses a
      // non-superuser administrator to restate attributes it does not hold itself, even unchanged.
      await sql.unsafe(
        exists
          ? `ALTER ROLE ${quoted} LOGIN PASSWORD ${quoteLiteral(password)}`
          : `CREATE ROLE ${quoted} LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE PASSWORD ${quoteLiteral(password)}`,
      );
      await sql.unsafe(`GRANT CONNECT ON DATABASE ${quoteIdent(database)} TO ${quoted}`);
      for (const { nspname } of schemas) {
        const schema = quoteIdent(nspname);
        await sql.unsafe(
          `GRANT USAGE ON SCHEMA ${schema} TO ${quoted};
           GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA ${schema} TO ${quoted};
           GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA ${schema} TO ${quoted};
           ALTER DEFAULT PRIVILEGES IN SCHEMA ${schema} GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ${quoted};
           ALTER DEFAULT PRIVILEGES IN SCHEMA ${schema} GRANT USAGE, SELECT ON SEQUENCES TO ${quoted};`,
        );
      }
      await sql.unsafe(`REVOKE ALL ON public.mzizi_target, public.mzizi_migrations FROM ${quoted}`);
    }
    return `roles ready for ${TARGET_NAME}: ${APPLICATION_ROLES.map((entry) => entry.role).join(", ")} on ${schemas.length} schema(s)`;
  });
}
