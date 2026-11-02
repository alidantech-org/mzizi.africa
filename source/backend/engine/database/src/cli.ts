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
 *   seed [reference|research|fixtures]   reference seed, agent-collected registry rows, or fixtures (_dev and _test only)
 *   integrity           check plain-id references, target kinds and derived geometry
 *   grants <role>       grant per-schema read access to a role
 *   grants-reviewer <role>  grant pipeline read (staging, engine, registry) to the reviewer role
 *   validate [runId]    validate pending candidates (errors make them invalid, the rest go to review)
 *   apply-review        move in-review candidates by their newest review decision (reviewer grant required)
 *   promote [runId]     promote approved candidates: record, attribution, verification, promotion decision
 *   candidates          counts of candidates by status
 *   export-targets      write ../../contracts/targets.json: stored tables and their fields, for mapping validation
 *   reset               drop every schema, migrate, seed reference and fixtures (_dev and _test only)
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { packageRoot, entitySchemas, engineSchemas, bookkeepingSchema, openDataSource, targetUrl } from "./config.ts";
import { checkIntegrity } from "./integrity.ts";
import { grantReadOnly, grantReviewerRead } from "./grants.ts";
import { applyReviewDecisions } from "./staging/review.ts";
import { promoteApproved, promoteCandidate } from "./staging/promotion.ts";
import { validateCandidates } from "./staging/validation.ts";
import { drift, generate, migrate, revertLast } from "./migrations.ts";
import { seedFixtures, seedReference, seedResearch } from "./seeds.ts";

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
    if (kind === "research") {
      console.log(`seeded research registry rows (${await withDb({}, seedResearch)} rows)`);
      break;
    }
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
  case "grants-reviewer": {
    if (!argument) throw new Error("usage: grants-reviewer <role>");
    const schemas = await withDb({}, (db) => grantReviewerRead(db, argument));
    console.log(`granted reviewer read on ${schemas.length} schemas to ${argument}`);
    break;
  }
  case "validate": {
    console.log(JSON.stringify(await withDb({}, (db) => validateCandidates(db, argument))));
    break;
  }
  case "apply-review": {
    console.log(JSON.stringify(await withDb({}, applyReviewDecisions)));
    break;
  }
  case "promote": {
    const results = await withDb({}, (db) => promoteApproved(db, argument));
    for (const r of results) console.log(`${r.outcome} ${r.candidateId}${r.targetId ? ` -> ${r.targetKind} ${r.targetId}` : ""}${r.reasons.length ? ` (${r.reasons.join("; ")})` : ""}`);
    console.log(`${results.filter((r) => r.outcome === "promoted").length} promoted, ${results.filter((r) => r.outcome === "deferred").length} deferred`);
    break;
  }
  case "promote-one": {
    if (!argument) throw new Error("usage: promote-one <candidateId>");
    console.log(JSON.stringify(await withDb({}, (db) => promoteCandidate(db, argument))));
    break;
  }
  case "candidates": {
    const rows = await withDb({}, (db) => db.query(`SELECT status, count(*)::int AS n FROM staging.candidates GROUP BY status ORDER BY status`));
    for (const row of rows) console.log(`${row.status}: ${row.n}`);
    break;
  }
  case "export-targets": {
    await withDb({}, async (db) => {
      const targets: Record<string, { fields: string[]; required: string[] }> = {};
      for (const meta of db.entityMetadatas) {
        const columns = meta.columns.filter((column) => !column.relationMetadata || column.isVirtual === false);
        targets[`${meta.schema}.${meta.tableName}`] = {
          fields: [...new Set(columns.map((column) => column.propertyName))].sort(),
          required: columns.filter((column) => !column.isNullable && column.default === undefined && !column.isGenerated && !["id", "createdAt", "updatedAt", "version"].includes(column.propertyName)).map((column) => column.propertyName).sort(),
        };
      }
      const out = join(packageRoot, "..", "..", "contracts", "targets.json");
      writeFileSync(out, `${JSON.stringify(Object.fromEntries(Object.entries(targets).sort(([a], [b]) => a.localeCompare(b))), null, 2)}\n`);
      console.log(`wrote ${out} (${Object.keys(targets).length} tables)`);
    });
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
