/**
 * Keeps the product API inside its boundary (AGENTS.md section 2, ARCHITECTURE.md section 7):
 * no scraping, extraction, OCR, migration or seeding code or dependencies in the API, no schema
 * synchronisation outside tests, and no write path outside the audit group.
 *
 *   bun tools/check-api-boundary.ts
 */
import { Glob } from "bun";
import { readFileSync } from "node:fs";
import { join, relative } from "node:path";

const api = join(import.meta.dir, "..", "..", "source/apps/api");
const violations: string[] = [];

// 1. Dependencies that belong to other services.
const forbiddenPackages = [/puppeteer/, /playwright/, /cheerio/, /jsdom/, /tesseract/, /pdf-?parse/, /pdfjs/, /sharp$/, /@aws-sdk\//, /^aws-sdk$/, /minio/, /multer/, /axios/, /alembic/, /knex/, /sequelize/, /openai/, /@anthropic-ai/, /langchain/];
const manifest = JSON.parse(readFileSync(join(api, "package.json"), "utf8")) as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
for (const name of Object.keys({ ...manifest.dependencies, ...manifest.devDependencies })) {
  if (forbiddenPackages.some((pattern) => pattern.test(name))) violations.push(`package.json: ${name} belongs to another service (data-engine, files, db-engine or intelligence)`);
}
// The Postgres driver is needed at runtime, not only in development.
if (!manifest.dependencies?.pg) violations.push("package.json: pg must be a runtime dependency");

// 2. Source rules, ignoring tests and test helpers (which create their own scratch schemas).
const isTest = (path: string) => /\.(spec|test)\.ts$/.test(path) || /\/(neutral|read)\/.*(fixture-loader)/.test(path) || path.endsWith("scratch-database.ts");
const sourceRules: Array<[RegExp, string]> = [
  [/synchronize:\s*true/, "schema synchronisation (schema is owned by db-engine)"],
  [/migrationsRun:\s*true/, "running migrations (owned by db-engine)"],
  [/migrations:\s*\[\s*[^\]\s]/, "a migrations path (owned by db-engine)"],
  [/\bseed(er|s|ing)?\b/i, "seeding (owned by db-engine)"],
  [/from ["'](puppeteer|playwright|cheerio|@aws-sdk\/[^"']+|openai|@anthropic-ai\/[^"']+)["']/, "ingestion, storage or AI code (data-engine, files, intelligence)"],
];
const sqlWrites = /\b(INSERT\s+INTO|UPDATE\s+\w+\s+SET|DELETE\s+FROM|TRUNCATE|DROP\s+TABLE|ALTER\s+TABLE|CREATE\s+TABLE)\b/i;
const repositoryWrites = /\.(save|insert|update|delete|remove|softDelete|upsert)\(/;

for await (const file of new Glob("src/**/*.ts").scan({ cwd: api, absolute: true })) {
  const rel = relative(api, file);
  if (isTest(rel)) continue;
  const source = readFileSync(file, "utf8");
  for (const [pattern, why] of sourceRules) if (pattern.test(source)) violations.push(`${rel}: ${why}`);
  const inAudit = rel.includes("/modules/audit/") || rel.endsWith("src/database/write-database.ts");
  if (!inAudit && (sqlWrites.test(source) || repositoryWrites.test(source))) violations.push(`${rel}: writes outside the audit group`);
}

if (violations.length > 0) {
  console.error(`API boundary violations (${violations.length}):`);
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}
console.log("API boundary OK");
