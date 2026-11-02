import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { Client } from "pg";
import type { DataSource } from "typeorm";

import { bookkeepingSchema, entitySchemas, openDataSource, packageRoot, targetUrl, withDatabase } from "./config.ts";

/** Creates the schemas migrations depend on (TypeORM needs a schema to exist before its enum types). */
async function ensureSchemas(db: DataSource): Promise<void> {
  for (const schema of [bookkeepingSchema, ...entitySchemas(db)]) await db.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);
}

export async function migrate(): Promise<string[]> {
  const { url } = targetUrl();
  const db = await openDataSource(url);
  try {
    await ensureSchemas(db);
    const applied = await db.runMigrations({ transaction: "each" });
    return applied.map((migration) => migration.name);
  } finally {
    await db.destroy();
  }
}

export async function revertLast(): Promise<void> {
  const { url } = targetUrl({ destructive: true });
  const db = await openDataSource(url);
  try {
    await db.undoLastMigration({ transaction: "each" });
  } finally {
    await db.destroy();
  }
}

/** A throwaway database (same server, name `<target>_diff`) used to compute what entities need beyond the migrations. */
async function diffAgainstMigrations(): Promise<{ up: string[]; down: string[]; newSchemas: string[] }> {
  const { url, database } = targetUrl();
  const scratch = `${database}_diff`;
  const admin = new Client({ connectionString: withDatabase(url, "postgres") });
  await admin.connect();
  try {
    await admin.query(`DROP DATABASE IF EXISTS ${scratch} WITH (FORCE)`);
    await admin.query(`CREATE DATABASE ${scratch}`);
  } finally {
    await admin.end();
  }
  const db = await openDataSource(withDatabase(url, scratch));
  try {
    const existingBefore = new Set<string>();
    await ensureSchemas(db);
    await db.runMigrations({ transaction: "each" });
    const schemasWithTables = await db.query(`SELECT DISTINCT table_schema FROM information_schema.tables`);
    for (const row of schemasWithTables) existingBefore.add(row.table_schema);
    const log = await db.driver.createSchemaBuilder().log();
    const newSchemas = entitySchemas(db).filter((schema) => !existingBefore.has(schema));
    return { up: log.upQueries.map((query) => query.query), down: log.downQueries.map((query) => query.query), newSchemas };
  } finally {
    await db.destroy();
    const cleanup = new Client({ connectionString: withDatabase(url, "postgres") });
    await cleanup.connect();
    await cleanup.query(`DROP DATABASE IF EXISTS ${scratch} WITH (FORCE)`);
    await cleanup.end();
  }
}

/** Drift check: the entities must need nothing beyond the committed migrations. Returns the missing statements. */
export async function drift(): Promise<string[]> {
  return (await diffAgainstMigrations()).up;
}

export async function generate(name: string): Promise<string | undefined> {
  const { up, down } = await diffAgainstMigrations();
  if (up.length === 0) return undefined;
  const stamp = Date.now();
  const className = `${name.replace(/(^|[-_ ])(\w)/g, (_, __, c: string) => c.toUpperCase())}${stamp}`;
  const literal = (queries: string[]) => queries.map((query) => `    await queryRunner.query(${JSON.stringify(query)});`).join("\n");
  const schemas = [...new Set(up.flatMap((query) => [...query.matchAll(/"([a-z_]+)"\./g)].map((match) => match[1]!)))].filter((schema) => schema !== "public");
  const createSchemas = schemas.map((schema) => `    await queryRunner.query(${JSON.stringify(`CREATE SCHEMA IF NOT EXISTS "${schema}"`)});`).join("\n");
  const source = `import type { MigrationInterface, QueryRunner } from "typeorm";

/** Generated from the Dryv entities by \`bun run db generate\`. Review before committing. */
export class ${className} implements MigrationInterface {
  name = "${className}";

  public async up(queryRunner: QueryRunner): Promise<void> {
${createSchemas}
${literal(up)}
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
${literal([...down].reverse())}
  }
}
`;
  const file = join(packageRoot, "migrations", `${stamp}-${name}.ts`);
  writeFileSync(file, source);
  return file;
}
