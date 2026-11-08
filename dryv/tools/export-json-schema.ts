/**
 * Exports the `exchange` group (layer-to-layer contracts) as JSON Schema so TypeScript and Python
 * share one source. Output: source/schema/contracts/exchange.schema.json.
 *
 *   bun tools/export-json-schema.ts          write the file
 *   bun tools/export-json-schema.ts --check  fail if the committed file is stale
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { compileIr, dryvRoot, type Json } from "./lib/ir.ts";

const group = "exchange";
const outPath = join(dryvRoot, "..", "source", "schema", "contracts", `${group}.schema.json`);
const items = compileIr();
const byName = new Map(items.map((i) => [`${i.kind.startsWith("property") ? "p" : i.kind}:${i.name}`, i]));

function propertySchema(ref: string): Json {
  const name = ref.split("/").pop()!;
  const item = items.find((i) => i.kind.startsWith("property") && i.name === name);
  if (!item) throw new Error(`unknown property ${ref}`);
  const v = item.value;
  if (item.kind === "property-enum") return { type: "string", enum: Object.values<Json>(v.values).map((e) => e.value) };
  if (item.kind === "property-temporal") return { type: "string", format: v.kind === "date" ? "date" : "date-time" };
  const out: Json = {};
  if (v.kind === "integer") {
    out.type = "integer";
    if (v.range?.min !== undefined) out.minimum = v.range.min;
    if (v.range?.max !== undefined) out.maximum = v.range.max;
  } else if (v.type === "number") {
    out.type = "number";
    if (v.range?.min !== undefined) out.minimum = v.range.min;
    if (v.range?.max !== undefined) out.maximum = v.range.max;
  } else if (v.type === "boolean") {
    out.type = "boolean";
  } else {
    out.type = "string";
    if (v.format === "uuid") out.format = "uuid";
    if (v.format === "url") out.format = "uri";
    if (v.length?.min !== undefined) out.minLength = v.length.min;
    if (v.length?.max !== undefined) out.maxLength = v.length.max;
  }
  return out;
}

function fieldSchema(field: Json): Json {
  const base = field.kind === "schema" ? { $ref: `#/$defs/${field.$ref.split(".").pop()}` } : propertySchema(field.$ref);
  return field.array ? { type: "array", items: base } : base;
}

const defs: Json = {};
for (const item of items.filter((i) => i.kind === "schema" && i.name.startsWith(`${group}.`))) {
  const fields = item.value.fields as Record<string, Json>;
  defs[item.name.split(".").pop()!] = {
    type: "object",
    additionalProperties: false,
    properties: Object.fromEntries(Object.entries(fields).map(([k, f]) => [k, fieldSchema(f)])),
    required: Object.entries(fields).filter(([, f]) => !f.optional).map(([k]) => k).sort(),
  };
}

const document = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://mzizi.africa/schemas/exchange/v1",
  title: "Mzizi layer exchange contracts",
  description: "Generated from dryv/contracts/domains/exchange by dryv/tools/export-json-schema.ts. Do not edit.",
  $defs: Object.fromEntries(Object.entries(defs).sort(([a], [b]) => a.localeCompare(b))),
};
const text = `${JSON.stringify(document, null, 2)}\n`;

if (process.argv.includes("--check")) {
  if (!existsSync(outPath) || readFileSync(outPath, "utf8") !== text) {
    console.error("exchange.schema.json is stale; run bun tools/export-json-schema.ts");
    process.exit(1);
  }
  console.log("exchange.schema.json is current");
} else {
  writeFileSync(outPath, text);
  console.log(`wrote ${outPath} (${Object.keys(defs).length} schemas)`);
}
