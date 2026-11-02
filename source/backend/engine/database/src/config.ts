import "reflect-metadata";

import { Glob } from "bun";
import { join } from "node:path";
import { DataSource } from "typeorm";

export const packageRoot = join(import.meta.dir, "..");
const apiRoot = join(packageRoot, "..", "..", "api");

/** History of applied migrations lives here so nothing is placed in `public`. */
export const bookkeepingSchema = "engine";
/** Schemas owned by hand-written migrations (not generated from Dryv entities). */
export const engineSchemas = ["staging", "access"];

const LOCAL_HOSTS = ["localhost", "127.0.0.1", "::1", "[::1]"];

/**
 * Safety rules shared by every command: only databases named mzizi_* are touched (the PostGIS
 * server also holds other projects' databases). Destructive commands also require a local host and
 * a name ending in _dev or _test.
 */
export function targetUrl(options: { destructive?: boolean } = {}): { url: string; database: string } {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required");
  const parsed = new URL(url);
  const database = parsed.pathname.slice(1);
  if (!/^mzizi_/.test(database)) throw new Error(`refusing to touch ${database}: only mzizi_* databases are managed here`);
  if (options.destructive) {
    if (!LOCAL_HOSTS.includes(parsed.hostname)) throw new Error(`refusing a destructive command on a non-local host: ${parsed.hostname}`);
    if (!/(_dev|_test)$/.test(database)) throw new Error(`refusing a destructive command on ${database}: the name must end in _dev or _test`);
  }
  return { url, database };
}

/** The generated Dryv entities are the schema source of truth; this package reads them, it never edits them. */
export async function loadEntities(): Promise<Function[]> {
  const entities: Function[] = [];
  for await (const file of new Glob("src/modules/*/entities/*.entity.ts").scan({ cwd: apiRoot, absolute: true })) {
    entities.push(...Object.values((await import(file)) as Record<string, Function>).filter((value) => typeof value === "function"));
  }
  return entities;
}

/** Migration classes in file-name order (names carry a timestamp, so order is chronological). */
export async function loadMigrations(): Promise<Function[]> {
  const migrations: Function[] = [];
  const files: string[] = [];
  for await (const file of new Glob("*.ts").scan({ cwd: join(packageRoot, "migrations"), absolute: true })) files.push(file);
  for (const file of files.sort()) migrations.push(...Object.values((await import(file)) as Record<string, Function>).filter((value) => typeof value === "function"));
  return migrations;
}

export async function openDataSource(url: string, options: { migrations?: boolean } = {}): Promise<DataSource> {
  const db = new DataSource({
    type: "postgres",
    url,
    entities: await loadEntities(),
    migrations: options.migrations === false ? [] : await loadMigrations(),
    migrationsTableName: "migrations",
    schema: bookkeepingSchema,
    synchronize: false,
  });
  await db.initialize();
  return db;
}

export function entitySchemas(db: DataSource): string[] {
  return [...new Set(db.entityMetadatas.map((meta) => meta.schema).filter((schema): schema is string => !!schema))].sort();
}

export function withDatabase(url: string, database: string): string {
  const parsed = new URL(url);
  parsed.pathname = `/${database}`;
  return parsed.toString();
}
