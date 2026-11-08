/**
 * Clean-rewrite database tooling (DEC-CLEAN-REWRITE-MZIZI-NEW). Works on the disposable `mzizi_new` database only.
 *
 *   bun src/rewrite.ts status                       applied rewrite migrations
 *   bun src/rewrite.ts init                         create mzizi_new if missing and apply pending rewrite migrations
 *   bun src/rewrite.ts reset                        drop and recreate mzizi_new, then init (verifies host and current_database())
 *   bun src/rewrite.ts bootstrap-admin <issuer> <subject> <name>   create the first platform administrator
 *
 * Migrations are plain SQL in ../rewrite, applied in file-name order and recorded with a checksum in public.migrations.
 */
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import pg from "pg";

import { packageRoot, REWRITE_DATABASE, rewriteTargetUrl } from "./config.ts";

const migrationsDir = join(packageRoot, "rewrite");

export function rewriteMigrationFiles(): Array<{ name: string; sql: string; checksum: string }> {
  return readdirSync(migrationsDir)
    .filter((file) => /^\d{4}_.+\.sql$/.test(file))
    .sort()
    .map((name) => {
      const sql = readFileSync(join(migrationsDir, name), "utf8");
      return { name, sql, checksum: createHash("sha256").update(sql).digest("hex") };
    });
}

/**
 * Refuses to continue unless the session is on mzizi_new. The host was already checked to be local from the URL
 * (rewriteTargetUrl); the server's own address is not used because the dev PostGIS runs in a container.
 */
export async function assertRewriteConnection(client: pg.Client): Promise<void> {
  const row = (await client.query(`SELECT current_database() AS db`)).rows[0];
  if (row.db !== REWRITE_DATABASE) throw new Error(`connected to ${row.db}, expected ${REWRITE_DATABASE}`);
  const host = (client as unknown as { host?: string }).host;
  if (host && !["localhost", "127.0.0.1", "::1"].includes(host)) throw new Error(`connected to non-local host ${host}`);
}

async function ensureDatabase(): Promise<void> {
  const { adminUrl, database } = rewriteTargetUrl();
  const admin = new pg.Client({ connectionString: adminUrl });
  await admin.connect();
  try {
    const exists = (await admin.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [database])).rowCount;
    if (!exists) await admin.query(`CREATE DATABASE ${database}`);
  } finally {
    await admin.end();
  }
}

export async function initRewrite(): Promise<string[]> {
  await ensureDatabase();
  const { url } = rewriteTargetUrl();
  const client = new pg.Client({ connectionString: url });
  await client.connect();
  const applied: string[] = [];
  try {
    await assertRewriteConnection(client);
    await client.query(`CREATE TABLE IF NOT EXISTS public.migrations (name text PRIMARY KEY, checksum text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now())`);
    const done = new Map((await client.query(`SELECT name, checksum FROM public.migrations`)).rows.map((row) => [row.name, row.checksum]));
    for (const migration of rewriteMigrationFiles()) {
      if (done.has(migration.name)) {
        if (done.get(migration.name) !== migration.checksum) throw new Error(`${migration.name} changed after it was applied; run reset (mzizi_new is disposable)`);
        continue;
      }
      await client.query("BEGIN");
      try {
        await client.query(migration.sql);
        await client.query(`INSERT INTO public.migrations (name, checksum) VALUES ($1, $2)`, [migration.name, migration.checksum]);
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw new Error(`${migration.name} failed: ${(error as Error).message}`);
      }
      applied.push(migration.name);
    }
  } finally {
    await client.end();
  }
  return applied;
}

export async function resetRewrite(): Promise<string[]> {
  const { url, adminUrl, database } = rewriteTargetUrl();
  const probe = new pg.Client({ connectionString: url });
  let exists = true;
  try {
    await probe.connect();
    await assertRewriteConnection(probe);
  } catch (error) {
    if ((error as { code?: string }).code === "3D000") exists = false;
    else throw error;
  } finally {
    await probe.end().catch(() => undefined);
  }
  if (exists) {
    const admin = new pg.Client({ connectionString: adminUrl });
    await admin.connect();
    try {
      await admin.query(`DROP DATABASE IF EXISTS ${database} WITH (FORCE)`);
    } finally {
      await admin.end();
    }
  }
  return initRewrite();
}

if (import.meta.main) {
  const [command, ...args] = process.argv.slice(2);
  switch (command) {
    case "status": {
      const { url } = rewriteTargetUrl();
      const client = new pg.Client({ connectionString: url });
      await client.connect();
      try {
        await assertRewriteConnection(client);
        const rows = (await client.query(`SELECT name, applied_at FROM public.migrations ORDER BY name`).catch(() => ({ rows: [] }))).rows;
        console.log(JSON.stringify({ database: REWRITE_DATABASE, applied: rows, known: rewriteMigrationFiles().map((m) => m.name) }, null, 2));
      } finally {
        await client.end();
      }
      break;
    }
    case "init":
      console.log(JSON.stringify({ applied: await initRewrite() }));
      break;
    case "reset":
      console.log(JSON.stringify({ applied: await resetRewrite() }));
      break;
    case "bootstrap-admin": {
      const [issuer, subject, name] = args;
      if (!issuer || !subject || !name) throw new Error("usage: bootstrap-admin <issuer> <subject> <display name>");
      const client = new pg.Client({ connectionString: rewriteTargetUrl().url });
      await client.connect();
      try {
        await assertRewriteConnection(client);
        const id = (await client.query(`SELECT auth.bootstrap_admin($1, $2, $3) AS id`, [issuer, subject, name])).rows[0].id;
        console.log(JSON.stringify({ accountId: id }));
      } finally {
        await client.end();
      }
      break;
    }
    default:
      console.error("usage: bun src/rewrite.ts status|init|reset|bootstrap-admin");
      process.exit(2);
  }
}
