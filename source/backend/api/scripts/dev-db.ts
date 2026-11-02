/**
 * Development only: creates the schema from the generated entities and loads the neutral-model
 * fixtures (Kenya, South Africa) into a LOCAL database, so the API has something to serve until
 * source/backend/db-engine owns schema and seeds. The API itself never does this.
 *
 *   DATABASE_URL=postgres://postgres@localhost:5432/mzizi_dev bun scripts/dev-db.ts schema
 *   DATABASE_URL=... bun scripts/dev-db.ts fixtures
 *   DATABASE_URL=... bun scripts/dev-db.ts reset      (schema, dropping everything first, then fixtures)
 */
import "reflect-metadata";

import { Glob } from "bun";
import { join } from "node:path";
import { DataSource } from "typeorm";

import { entitySchemas, synchronizeDomainSchemas } from "../src/database/scratch-database.ts";
import { loadFixtures, readFixture } from "../src/neutral/fixture-loader.ts";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is required");
const parsed = new URL(url);
if (!["localhost", "127.0.0.1", "::1", "[::1]"].includes(parsed.hostname)) throw new Error(`refusing to touch a non-local database: ${parsed.hostname}`);
const database = parsed.pathname.slice(1);
if (!/(_dev|_test)$/.test(database)) throw new Error(`refusing to touch ${database}: the database name must end in _dev or _test`);

const entities: Function[] = [];
for await (const file of new Glob("src/modules/*/entities/*.entity.ts").scan({ cwd: join(import.meta.dir, ".."), absolute: true })) {
  entities.push(...Object.values((await import(file)) as Record<string, Function>));
}

const command = process.argv[2] ?? "reset";
const db = new DataSource({ type: "postgres", url, entities, synchronize: false });
await db.initialize();
try {
  if (command === "schema" || command === "reset") {
    // Tables live in per-domain schemas (.docs/rules/database-naming.md); TypeORM only drops public itself.
    if (command === "reset") for (const schema of entitySchemas(db)) await db.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
    await synchronizeDomainSchemas(db);
  }
  if (command === "fixtures" || command === "reset") {
    const ids = await loadFixtures(db, readFixture("kenya").rows);
    await loadFixtures(db, readFixture("south-africa").rows, ids);
    console.log(`Loaded ${ids.size} fixture rows`);
  }
  console.log(`${command} done on ${database}`);
} finally {
  await db.destroy();
}
