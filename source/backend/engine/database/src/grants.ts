import type { DataSource } from "typeorm";

import { entitySchemas } from "./config.ts";

/**
 * Roles are per schema: USAGE on the schema plus SELECT on its tables (nothing lives in `public`).
 * The API connects with a role granted here and never needs more. `staging` and `engine` are not
 * readable by the API role.
 */
export async function grantReadOnly(db: DataSource, role: string): Promise<string[]> {
  if (!/^[a-z_][a-z0-9_]*$/.test(role)) throw new Error(`invalid role name: ${role}`);
  const schemas = entitySchemas(db);
  for (const schema of schemas) {
    await db.query(`GRANT USAGE ON SCHEMA "${schema}" TO ${role}`);
    await db.query(`GRANT SELECT ON ALL TABLES IN SCHEMA "${schema}" TO ${role}`);
  }
  return schemas;
}
