import type { DataSource } from "typeorm";

import { entitySchemas } from "./config.ts";

/**
 * Roles are per schema: USAGE on the schema plus SELECT on its tables (nothing lives in `public`).
 * The API connects with a role granted here and never needs more. `engine` is not readable by the API
 * role, and `staging` only exposes candidate ids.
 */
export async function grantReadOnly(db: DataSource, role: string): Promise<string[]> {
  if (!/^[a-z_][a-z0-9_]*$/.test(role)) throw new Error(`invalid role name: ${role}`);
  const schemas = entitySchemas(db);
  for (const schema of schemas) {
    await db.query(`GRANT USAGE ON SCHEMA "${schema}" TO ${role}`);
    await db.query(`GRANT SELECT ON ALL TABLES IN SCHEMA "${schema}" TO ${role}`);
  }
  // The API validates review-decision targets: it may see that a staging candidate exists, never its payload.
  await db.query(`GRANT USAGE ON SCHEMA staging TO ${role}`);
  await db.query(`GRANT SELECT (id) ON staging.candidates TO ${role}`);
  return schemas;
}

/**
 * The reviewer connection: read access to the pipeline (staging, engine jobs, website registry, source,
 * filesystem and access catalogue) for endpoints guarded by `pipeline.read`. It cannot write anywhere;
 * writes (decisions, promotion) use their own roles. Never handed to public-facing reads.
 */
export async function grantReviewerRead(db: DataSource, role: string): Promise<string[]> {
  if (!/^[a-z_][a-z0-9_]*$/.test(role)) throw new Error(`invalid role name: ${role}`);
  const schemas = ["staging", "engine", "website", "source", "filesystem", "audit", "access", "identity"];
  for (const schema of schemas) {
    await db.query(`GRANT USAGE ON SCHEMA "${schema}" TO ${role}`);
    await db.query(`GRANT SELECT ON ALL TABLES IN SCHEMA "${schema}" TO ${role}`);
  }
  return schemas;
}
