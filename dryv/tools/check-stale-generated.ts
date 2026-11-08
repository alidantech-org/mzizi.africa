/**
 * Dryv never deletes generated files for contracts that were removed or renamed. This finds the
 * leftovers that matter most: entity files whose schema.table no longer exists in the contracts
 * (they would still be picked up by the ORM and create phantom tables), and module folders for
 * groups that no longer exist.
 *
 *   bun tools/check-stale-generated.ts
 */
import { Glob } from "bun";
import { readFileSync } from "node:fs";
import { join, relative } from "node:path";

import { compileIr, storageOf } from "./lib/ir.ts";

const items = compileIr();
const expected = new Set(
  items
    .filter((item) => item.kind === "schema" && item.value.role === "entity" && !item.value.abstract)
    .map((item) => storageOf(items, item.value))
    .map(({ schema, table }) => `${schema}.${table}`),
);
const groups = new Set(items.filter((item) => item.kind === "group").map((item) => item.name));

const api = join(import.meta.dir, "..", "..", "source/backend/api/src/modules");
const stale: string[] = [];
for await (const file of new Glob("*/entities/*.entity.ts").scan({ cwd: api, absolute: true })) {
  const match = readFileSync(file, "utf8").match(/@Entity\(\{ schema: "(\w+)", name: "(\w+)" \}\)/);
  const qualified = match ? `${match[1]}.${match[2]}` : "(no schema)";
  if (!expected.has(qualified)) stale.push(`${relative(api, file)}: ${qualified} is not in the contracts`);
}
for await (const dir of new Glob("*/").scan({ cwd: api, onlyFiles: false })) {
  const name = dir.replace(/\/$/, "");
  if (name !== "common" && !groups.has(name)) stale.push(`${name}/: no contract group of this name`);
}

if (stale.length > 0) {
  console.error(`Stale generated files (${stale.length}); delete them:`);
  for (const line of stale) console.error(`- ${line}`);
  process.exit(1);
}
console.log("No stale generated entities");
