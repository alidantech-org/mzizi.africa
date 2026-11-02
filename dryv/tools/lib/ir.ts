import { spawnSync } from "node:child_process";
import { join } from "node:path";

export type Json = Record<string, any>;
export type Item = { kind: string; name: string; value: Json };

export const dryvRoot = join(import.meta.dir, "..", "..");

/** Compiles the contracts and returns the Runtime IR items; exits with the diagnostics on failure. */
export function compileIr(): Item[] {
  const compile = spawnSync("bun", ["x", "dryv-ts", "compile", "contracts/index.ts"], { cwd: dryvRoot, encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
  if (compile.status !== 0) {
    console.error(compile.stdout.split("\n").filter((l) => l.includes('"diagnostic"') || l.includes('"error"')).join("\n") || compile.stderr);
    process.exit(1);
  }
  const items: Item[] = [];
  for (const line of compile.stdout.split("\n")) {
    if (line.startsWith('{"items"')) items.push(...(JSON.parse(line).items as Item[]));
  }
  return items;
}

/** Where an entity is stored: the group's storage namespace (a database schema) and the entity's table name. */
export function storageOf(items: Item[], schema: Json): { schema?: string; table?: string } {
  const group = items.find((item) => item.kind === "group" && `#/groups/${item.name}` === schema.group?.$ref);
  return { schema: group?.value.facets?.storage?.namespace, table: schema.facets?.storage?.name };
}
