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

/** Administrative connection (DDL, ledger). Read only by the CLI, never by the engine or the API. */
export function adminUrl(env: NodeJS.ProcessEnv = process.env): string {
  const url = env.MZIZI_DB_ADMIN_URL;
  if (!url) throw new Error("MZIZI_DB_ADMIN_URL is required for this command");
  return url;
}

/** Roles provisioned for application access, with the environment variable holding each password. */
export const APPLICATION_ROLES = [
  { role: "mzizi_engine", passwordEnv: "MZIZI_DB_ENGINE_PASSWORD" },
  { role: "mzizi_api", passwordEnv: "MZIZI_DB_API_PASSWORD" },
] as const;
