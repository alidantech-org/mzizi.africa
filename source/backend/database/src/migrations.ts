/** TypeORM migration runner for the disposable mzizi_new database. */
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Client } from "pg";
import { DataSource, type MigrationInterface, type QueryRunner } from "typeorm";

type MigrationSql = { name: string; sql: string; checksum: string };
const repository = resolve(import.meta.dir, "../../../..");
const schemaRoot = resolve(repository, "source/schema/database");
const lockKey = "mzizi.database.migrations";

function assertTarget(connectionString: string): void {
  const url = new URL(connectionString);
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (!["localhost", "127.0.0.1", "::1", "postgis"].includes(host)) throw new Error(`Refusing non-local database host ${host}`);
  if (url.pathname.slice(1) !== "mzizi_new") throw new Error("Only mzizi_new may be migrated");
}

async function migrationSql(): Promise<MigrationSql[]> {
  const manifest = await readFile(resolve(schemaRoot, "migrations.yaml"), "utf8");
  const names = [...manifest.matchAll(/^\s+-\s+([\w/-]+\.sql)\s*$/gm)].map((match) => match[1]).filter((value): value is string => Boolean(value));
  if (!names.length) throw new Error("No SQL migrations found");
  return Promise.all(names.map(async (name) => {
    if (name.startsWith("/") || name.split("/").includes("..")) throw new Error(`Invalid migration path: ${name}`);
    const sql = await readFile(resolve(schemaRoot, name), "utf8");
    return { name, sql, checksum: createHash("sha256").update(sql).digest("hex") };
  }));
}

function migrationClass(source: MigrationSql, index: number): new () => MigrationInterface {
  const timestamp = migrationTimestamp(index);
  const GeneratedMigration = class implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(source.sql);
      await queryRunner.query("INSERT INTO public.mzizi_migration_checksums(name, checksum) VALUES ($1, $2)", [source.name, source.checksum]);
    }
    async down(): Promise<void> {
      throw new Error(`Migration ${source.name} is immutable; reset only the disposable local database instead`);
    }
  };
  Object.defineProperty(GeneratedMigration, "name", { value: migrationName(index) });
  return GeneratedMigration;
}

function migrationTimestamp(index: number): number { return 1_800_000_000_000 + index; }
function migrationName(index: number): string { return `Mzizi${String(index + 1).padStart(4, "0")}${migrationTimestamp(index)}`; }

function checkedLegacyRows(rows: Array<{ name: string; checksum: string }>, migrations: MigrationSql[]): Map<string, string> {
  const expected = new Map(migrations.map((migration) => [migration.name, migration.checksum]));
  const result = new Map<string, string>();
  for (const row of rows) {
    if (!expected.has(row.name)) throw new Error(`Legacy migration ${row.name} is not present in the active migration manifest`);
    if (expected.get(row.name) !== row.checksum) throw new Error(`${row.name} checksum differs from the legacy migration ledger`);
    result.set(row.name, row.checksum);
  }
  return result;
}

function makeDataSource(connectionString: string, migrations: Array<new () => MigrationInterface>) {
  return new DataSource({ type: "postgres", url: connectionString, entities: [], migrations, synchronize: false, migrationsRun: false, migrationsTableName: "mzizi_typeorm_migrations", migrationsTransactionMode: "all" });
}

export async function getStatus(connectionString: string) {
  assertTarget(connectionString);
  const sql = await migrationSql();
  const source = makeDataSource(connectionString, []);
  await source.initialize();
  try {
    const database = await source.query("SELECT current_database() AS database");
    const historyTable = await source.query("SELECT to_regclass('public.mzizi_typeorm_migrations') AS name");
    const checksTable = await source.query("SELECT to_regclass('public.mzizi_migration_checksums') AS name");
    const legacyTable = await source.query("SELECT to_regclass('public.migrations') AS name");
    const history = historyTable[0]?.name ? await source.query("SELECT name FROM public.mzizi_typeorm_migrations ORDER BY id") : [];
    const checks = checksTable[0]?.name ? await source.query("SELECT name, checksum FROM public.mzizi_migration_checksums") : [];
    const legacyRows = legacyTable[0]?.name ? await source.query("SELECT name, checksum FROM public.migrations ORDER BY applied_at, name") : [];
    const byName = new Map(checks.map((row: { name: string; checksum: string }) => [row.name, row.checksum]));
    for (const migration of sql) if (byName.has(migration.name) && byName.get(migration.name) !== migration.checksum) throw new Error(`${migration.name} checksum mismatch`);
    const legacy = checkedLegacyRows(legacyRows, sql);
    const applied = new Set<string>(legacy.keys());
    for (const row of history as Array<{ name: string }>) {
      const index = Number(row.name.match(/^Mzizi(\d{4})/)?.[1]) - 1;
      const migration = sql[index];
      if (!migration || row.name !== migrationName(index)) throw new Error(`Unknown TypeORM migration ${row.name}`);
      const recordedChecksum = byName.get(migration.name) ?? legacy.get(migration.name);
      if (!recordedChecksum) throw new Error(`${migration.name} is applied without a checksum record`);
      if (recordedChecksum !== migration.checksum) throw new Error(`${migration.name} checksum mismatch`);
      applied.add(migration.name);
    }
    for (const [name, checksum] of byName) {
      const migration = sql.find((item) => item.name === name);
      if (!migration || checksum !== migration.checksum) throw new Error(`${name} checksum entry is unknown or mismatched`);
    }
    return { database: database[0]?.database, applied: sql.filter((item) => applied.has(item.name)).map((item) => item.name), pending: sql.filter((item) => !applied.has(item.name)).map((item) => item.name) };
  } finally { await source.destroy(); }
}

export async function migrate(connectionString: string): Promise<string[]> {
  assertTarget(connectionString);
  const sql = await migrationSql();
  const source = makeDataSource(connectionString, sql.map((item, index) => migrationClass(item, index)));
  await source.initialize();
  const runner = source.createQueryRunner();
  let locked = false;
  try {
    const result = await runner.query("SELECT current_database() AS database");
    if (result[0]?.database !== "mzizi_new") throw new Error("Connected database is not mzizi_new");
    await runner.query("SELECT pg_advisory_lock(hashtext($1))", [lockKey]); locked = true;
    await runner.query("CREATE TABLE IF NOT EXISTS public.mzizi_migration_checksums(name text PRIMARY KEY, checksum text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now())");
    const checks = await runner.query("SELECT name, checksum FROM public.mzizi_migration_checksums");
    const existing = new Map(checks.map((row: { name: string; checksum: string }) => [row.name, row.checksum]));
    for (const migration of sql) if (existing.has(migration.name) && existing.get(migration.name) !== migration.checksum) throw new Error(`${migration.name} changed after application; migration files are immutable`);
    const legacyTable = await runner.query("SELECT to_regclass('public.migrations') AS name");
    const legacyRows: Array<{ name: string; checksum: string }> = legacyTable[0]?.name ? await runner.query("SELECT name, checksum FROM public.migrations ORDER BY applied_at, name") : [];
    const legacy = checkedLegacyRows(legacyRows, sql);
    for (const [name, checksum] of legacy) {
      if (existing.has(name) && existing.get(name) !== checksum) throw new Error(`${name} differs between legacy and TypeScript checksum ledgers`);
      await runner.query("INSERT INTO public.mzizi_migration_checksums(name,checksum) VALUES($1,$2) ON CONFLICT(name) DO NOTHING", [name, checksum]);
    }
    await runner.query(`CREATE TABLE IF NOT EXISTS public.mzizi_typeorm_migrations(
      id serial PRIMARY KEY, timestamp bigint NOT NULL, name varchar NOT NULL
    )`);
    const before = await runner.query("SELECT name FROM public.mzizi_typeorm_migrations ORDER BY id");
    const appliedNames = new Set(before.map((row: { name: string }) => row.name));
    for (const name of legacy.keys()) {
      const index = sql.findIndex((migration) => migration.name === name);
      const typeormName = migrationName(index);
      if (!appliedNames.has(typeormName)) {
        await runner.query("INSERT INTO public.mzizi_typeorm_migrations(timestamp,name) VALUES($1,$2)", [migrationTimestamp(index), typeormName]);
        appliedNames.add(typeormName);
      }
    }
    const ran = await source.runMigrations({ transaction: "all" });
    return ran.filter((migration) => !appliedNames.has(migration.name)).map((migration) => migration.name);
  } finally {
    if (locked) await runner.query("SELECT pg_advisory_unlock(hashtext($1))", [lockKey]).catch(() => undefined);
    await runner.release();
    await source.destroy();
  }
}

/** Rebuild and migrate only the explicitly disposable local mzizi_new database. */
export async function resetLocalDatabase(connectionString: string): Promise<string[]> {
  assertTarget(connectionString);
  const adminUrl = new URL(connectionString);
  adminUrl.pathname = "/postgres";
  const client = new Client({ connectionString: adminUrl.toString() });
  await client.connect();
  try {
    const [{ database }] = await client.query("SELECT current_database() AS database").then((result) => result.rows);
    if (database !== "postgres") throw new Error("Reset administration connection must use the postgres database");
    await client.query("DROP DATABASE IF EXISTS mzizi_new WITH (FORCE)");
    await client.query("CREATE DATABASE mzizi_new TEMPLATE template0");
  } finally {
    await client.end();
  }
  return migrate(connectionString);
}
