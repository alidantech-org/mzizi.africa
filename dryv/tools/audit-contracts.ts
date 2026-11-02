/**
 * Mzizi contract audit. Compiles the contracts to Runtime IR and checks the rules AGENTS.md puts
 * on the canonical model, so problems surface before any code is generated.
 *
 *   bun tools/audit-contracts.ts
 */
import { compileIr, storageOf, type Json } from "./lib/ir.ts";

const items = compileIr();

const violations: string[] = [];
const schemas = new Map(items.filter((i) => i.kind === "schema").map((i) => [i.name, i.value]));

/** Entities that are deliberately not evidence-bearing claims (for example user comments). */
const evidenceExempt = new Set<string>(["audit.Comment", "audit.ReviewDecision", "audit.EvidenceReference"]);

function ref(value: Json | undefined): string | undefined {
  return value?.$ref?.replace("#/schemas/", "");
}

function chain(name: string): string[] {
  const seen: string[] = [];
  let current: string | undefined = name;
  while (current && !seen.includes(current)) {
    seen.push(current);
    current = ref(schemas.get(current)?.extends);
  }
  return seen;
}

/** Names the generated test helpers already use; a schema with one of these names breaks the example files. */
const reservedSchemaNames = new Set(["Contract"]);
for (const name of schemas.keys()) {
  if (reservedSchemaNames.has(name.split(".").pop() ?? "")) violations.push(`${name}: reserved schema name (collides with a generated helper); rename it`);
}

const tables = new Map<string, string>();
for (const [name, schema] of schemas) {
  if (schema.role !== "entity" || schema.abstract) continue;

  // 1. Provenance and time are part of every claim-bearing record (AGENTS.md sections 4 and 6).
  if (!evidenceExempt.has(name) && !chain(name).includes("shared.EvidencedEntity")) {
    violations.push(`${name}: entity must extend shared.EvidencedEntity (provenance, valid time, verification)`);
  }

  // 2. The entity pack names a relation property after its target; two relations collide.
  const targets = new Map<string, string[]>();
  for (const [field, spec] of Object.entries<Json>(schema.fields ?? {})) {
    const target = ref(spec.relation?.target);
    if (target) targets.set(target, [...(targets.get(target) ?? []), field]);
  }
  for (const [target, fields] of targets) {
    if (fields.length > 1) violations.push(`${name}: fields ${fields.join(", ")} all relate to ${target}; keep one relation and make the others plain ids`);
  }

  // 3. Storage follows .docs/rules/database-naming.md.
  const { schema: dbSchema, table } = storageOf(items, schema);
  if (!dbSchema || !table) {
    violations.push(`${name}: entity needs a storage namespace (database schema) and a table name`);
    continue;
  }
  const qualified = `${dbSchema}.${table}`;
  if (dbSchema === "public") violations.push(`${name}: tables must not live in the public schema`);
  if (!/^[a-z][a-z0-9]*$/.test(dbSchema)) violations.push(`${name}: schema ${dbSchema} must be one lowercase word`);
  if (dbSchema.endsWith("s") && !["address"].includes(dbSchema)) violations.push(`${name}: schema ${dbSchema} must be singular`);
  if (!/^[a-z][a-z0-9]*(_[a-z][a-z0-9]*)?$/.test(table)) violations.push(`${name}: table ${table} must be lowercase with at most one underscore`);
  if (table.startsWith(`${dbSchema}_`) || table === dbSchema) violations.push(`${name}: table ${table} repeats its schema ${dbSchema}`);
  if (!table.endsWith("s") && !table.endsWith("people") && !table.endsWith("evidence")) violations.push(`${name}: table ${table} should be plural`);
  if (tables.has(qualified)) violations.push(`${name}: ${qualified} already used by ${tables.get(qualified)}`);
  else tables.set(qualified, name);
}

// 4. Strings longer than PostgreSQL's varchar limit must be unbounded text.
for (const item of items.filter((i) => i.kind === "property-primitive")) {
  const max = item.value?.length?.max;
  if (typeof max === "number" && max > 10_485_760) violations.push(`${item.name}: length max ${max} exceeds the varchar limit; omit max for text`);
}

// 5. Contracts never name a country: Kenya (and any other) is data scoped to a jurisdiction.
const countryTerms = /\b(kenya|kenyan|iebc|kra|nairobi|uganda|tanzania|ghana|nigeria)\b/i;
for (const item of items) {
  if (item.kind === "info") continue;
  const text = JSON.stringify({ name: item.name, value: item.value }, (key, v) => (key === "source" ? undefined : v));
  const hit = text.match(countryTerms);
  if (hit) violations.push(`${item.kind} ${item.name}: contains country-specific term "${hit[0]}"`);
}

// 6. HTTP operations: public paths are versioned and every operation maps at least one failure.
for (const item of items.filter((i) => i.kind === "operation")) {
  const http = item.value?.facets?.http;
  if (!http) continue;
  if (!String(http.path ?? "").startsWith("/v1/")) violations.push(`${item.name}: path ${http.path} must start with /v1/`);
  if (!http.failures || http.failures.length === 0) violations.push(`${item.name}: no failure mappings`);
}

if (violations.length > 0) {
  console.error(`Contract audit failed (${violations.length}):`);
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}
console.log(`Contract audit OK (${schemas.size} schemas, ${items.filter((i) => i.kind === "operation").length} operations)`);
