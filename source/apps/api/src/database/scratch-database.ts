import { Client } from "pg";
import type { DataSource } from "typeorm";

/**
 * Test helper: creates (or recreates) a scratch database on the server named by TEST_DATABASE_URL
 * and returns its connection URL, so integration suites that run in parallel never share a schema.
 */
export async function scratchDatabase(adminUrl: string, name: string): Promise<string> {
  const admin = new URL(adminUrl);
  const client = new Client({ connectionString: adminUrl });
  await client.connect();
  try {
    await client.query(`DROP DATABASE IF EXISTS ${name} WITH (FORCE)`);
    await client.query(`CREATE DATABASE ${name}`);
  } finally {
    await client.end();
  }
  admin.pathname = `/${name}`;
  return admin.toString();
}

/** Distinct database schemas of every entity a data source knows. */
export function entitySchemas(db: DataSource): string[] {
  return [...new Set(db.entityMetadatas.map((meta) => meta.schema).filter((schema): schema is string => !!schema))].sort();
}

/** Test helper: the SELECT-only role used for every domain read, granted per schema (nothing lives in public). */
export async function grantReadOnly(db: DataSource, role: string): Promise<void> {
  for (const schema of entitySchemas(db)) {
    await db.query(`GRANT USAGE ON SCHEMA "${schema}" TO ${role}`);
    await db.query(`GRANT SELECT ON ALL TABLES IN SCHEMA "${schema}" TO ${role}`);
  }
}

/**
 * Creates every domain schema, then synchronises tables. TypeORM creates enum types before it
 * creates a table's schema, so schemas must exist first. Development and tests only: the database
 * engine owns schema in production.
 */
export async function synchronizeDomainSchemas(db: DataSource): Promise<void> {
  for (const schema of entitySchemas(db)) await db.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);
  await db.synchronize();
}
