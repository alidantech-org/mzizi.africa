/** Locations and connection settings for the database CLI. Nothing here has a default database. */
import { join, resolve } from "node:path";

/** The one logical database. Its identity is recorded in `public.mzizi_target` and checked on every command. */
export const TARGET_NAME = "mzizi";

const root = resolve(import.meta.dir, "..");

export interface Paths {
  /** Generated schema snapshot written by the Dryv `postgres-sql` pack. */
  readonly snapshot: string;
  /** Immutable release stream (`NNNN_name.sql` plus the `.snapshot` checksum record). */
  readonly releases: string;
}

export function paths(env: NodeJS.ProcessEnv = process.env): Paths {
  return {
    snapshot: env.MZIZI_DB_SNAPSHOT ?? join(root, "sql", "schema.sql"),
    releases: env.MZIZI_DB_MIGRATIONS_DIR ?? join(root, "migrations"),
  };
}

/** The database name inside a PostgreSQL connection URL. */
export function databaseOf(url: string): string {
  return decodeURIComponent(new URL(url).pathname.replace(/^\//, ""));
}

/**
 * The one database this checkout may use: `MZIZI_DB_NAME` from the root `.env` (`mzizix` locally). Every command
 * refuses an administrative URL that names any other database, so no scratch, test or "just for now" database can
 * be created, migrated or reset by accident.
 */
export function databaseName(env: NodeJS.ProcessEnv = process.env): string {
  const name = env.MZIZI_DB_NAME;
  if (!name) throw new Error("MZIZI_DB_NAME is required (set it in the root .env)");
  return name;
}

/** Administrative connection (DDL, ledger). Read only by the CLI, never by the engine or the API. */
export function adminUrl(env: NodeJS.ProcessEnv = process.env): string {
  const url = env.MZIZI_DB_ADMIN_URL;
  if (!url) throw new Error("MZIZI_DB_ADMIN_URL is required for this command");
  const actual = databaseOf(url);
  if (actual !== databaseName(env)) {
    throw new Error(`refusing to use database ${JSON.stringify(actual)}: this checkout uses only ${JSON.stringify(databaseName(env))} (MZIZI_DB_NAME)`);
  }
  return url;
}

/** The same server's maintenance database, used only to drop and create the one database in `reset`. */
export function maintenanceUrl(env: NodeJS.ProcessEnv = process.env): string {
  const url = new URL(adminUrl(env));
  url.pathname = "/postgres";
  return url.toString();
}

/** Roles provisioned for application access, with the environment variable holding each password. */
export const APPLICATION_ROLES = [
  { role: "mzizi_engine", passwordEnv: "MZIZI_DB_ENGINE_PASSWORD" },
  { role: "mzizi_api", passwordEnv: "MZIZI_DB_API_PASSWORD" },
] as const;
