/**
 * Database management engine CLI. Owns schema, migrations, seeds, integrity and grants; the API never does.
 *
 *   DATABASE_URL=postgres://postgres@localhost:5432/mzizi_dev bun src/cli.ts <command>
 *
 *   status              applied and pending migrations, schemas and tables
 *   migrate             apply pending migrations
 *   revert              undo the last migration (_dev and _test only)
 *   generate <name>     write a migration for what the Dryv entities need beyond the existing ones
 *   check               drift check: fails when entities need statements the migrations do not provide
 *   seed [reference|fixtures]   reference seed, or fixtures (_dev and _test only)
 *   integrity           check plain-id references, target kinds and derived geometry
 *   grants <role>       grant per-schema read access to a role
 *   reset               drop every schema, migrate, seed reference and fixtures (_dev and _test only)
 */
import { entitySchemas, engineSchemas, bookkeepingSchema, openDataSource, targetUrl } from "./config.ts";
import { checkIntegrity } from "./integrity.ts";
import { grantReadOnly } from "./grants.ts";
import { drift, generate, migrate, revertLast } from "./migrations.ts";
import { seedFixtures, seedReference } from "./seeds.ts";

const [command, argument] = process.argv.slice(2);

async function withDb<T>(options: { destructive?: boolean }, work: (db: Awaited<ReturnType<typeof openDataSource>>) => Promise<T>): Promise<T> {
  const { url } = targetUrl(options);
  const db = await openDataSource(url);
  try {
    return await work(db);
  } finally {
    await db.destroy();
  }
}

switch (command) {
  case "status": {
    await withDb({}, async (db) => {
      const tableExists = (await db.query(`SELECT to_regclass('${bookkeepingSchema}.migrations') AS name`))[0].name;
      const applied: Array<{ name: string }> = tableExists ? await db.query(`SELECT name FROM "${bookkeepingSchema}".migrations ORDER BY id`) : [];
      const known = db.migrations.map((migration) => (migration as { name?: string }).name ?? migration.constructor.name);
      const pending = known.filter((name) => !applied.some((row) => row.name === name));
      const [counts] = await db.query(`SELECT count(DISTINCT table_schema)::int AS schemas, count(*)::int AS tables FROM information_schema.tables WHERE table_schema = ANY($1) AND table_type = 'BASE TABLE'`, [[...entitySchemas(db), ...engineSchemas]]);
      console.log(`applied ${applied.length}, pending ${pending.length}; ${counts.schemas} schemas, ${counts.tables} tables`);
      for (const name of pending) console.log(`  pending: ${name}`);
    });
    break;
  }
  case "migrate": {
    const applied = await migrate();
    console.log(applied.length ? `applied: ${applied.join(", ")}` : "nothing to apply");
    break;
  }
  case "revert":
    await revertLast();
    console.log("reverted the last migration");
    break;
  case "generate": {
    if (!argument) throw new Error("usage: generate <name>");
    const file = await generate(argument);
    console.log(file ? `wrote ${file}` : "entities need nothing beyond the existing migrations");
    break;
  }
  case "check": {
    const missing = await drift();
    if (missing.length) {
      console.error(`entities and migrations have drifted (${missing.length} statements); run: bun src/cli.ts generate <name>`);
      for (const query of missing.slice(0, 10)) console.error(`  ${query.slice(0, 160)}`);
      process.exit(1);
    }
    console.log("entities and migrations agree");
    break;
  }
  case "seed": {
    const kind = argument ?? "reference";
    await withDb({ destructive: kind === "fixtures" }, async (db) => {
      const ids = await seedReference(db);
      if (kind === "fixtures") console.log(`loaded ${await seedFixtures(db, ids)} rows`);
      else console.log(`seeded reference data (${ids.size} rows)`);
    });
    break;
  }
  case "integrity": {
    const issues = await withDb({}, checkIntegrity);
    for (const issue of issues) console.error(`${issue.count} x ${issue.rule}  e.g. ${issue.samples.join(", ")}`);
    console.log(issues.length ? `${issues.length} integrity rule(s) violated` : "integrity ok");
    process.exit(issues.length ? 1 : 0);
  }
  case "grants": {
    if (!argument) throw new Error("usage: grants <role>");
    const schemas = await withDb({}, (db) => grantReadOnly(db, argument));
    console.log(`granted read on ${schemas.length} schemas to ${argument}`);
    break;
  }
  case "reset": {
    await withDb({ destructive: true }, async (db) => {
      for (const schema of [...entitySchemas(db), ...engineSchemas, bookkeepingSchema]) await db.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
    });
    const applied = await migrate();
    await withDb({ destructive: true }, async (db) => {
      const ids = await seedReference(db);
      console.log(`reset: ${applied.length} migration(s), ${await seedFixtures(db, ids)} fixture rows`);
    });
    break;
  }
  default:
    console.error("commands: status | migrate | revert | generate <name> | check | seed [reference|fixtures] | integrity | grants <role> | reset");
    process.exit(command ? 1 : 0);
}
