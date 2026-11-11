/** Compile Dryv's persistent entity contracts into a stable, reviewable database catalog. */
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

type IrItem = { kind: string; name: string; value: Record<string, any> };
type ColumnContract = {
  name: string;
  type: string;
  definition: Record<string, unknown>;
  optional: boolean;
  nullable: boolean;
  relation?: { target: string; field: string; cardinality: string };
};
type TableContract = {
  schema: string;
  table: string;
  entity: string;
  primaryKey: string[];
  columns: ColumnContract[];
  indexes: Array<{ name: string; fields: string[]; unique: boolean }>;
};

const repository = resolve(import.meta.dir, "../../../..");
const dryvRoot = resolve(repository, "dryv");
const output = resolve(import.meta.dir, "../generated/dryv-schema-contract.json");

function compile(): IrItem[] {
  const result = execFileSync("bun", ["--bun", "x", "dryv-ts", "compile", "contracts/index.ts"], {
    cwd: dryvRoot,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  const items: IrItem[] = [];
  for (const [lineNumber, line] of result.split("\n").entries()) {
    if (!line.trim()) continue;
    let frame: Record<string, any>;
    try {
      frame = JSON.parse(line);
    } catch {
      throw new Error(`Dryv compiler emitted invalid JSON at output line ${lineNumber + 1}`);
    }
    if (frame.type === "error") throw new Error(`Dryv compiler failed: ${JSON.stringify(frame)}`);
    if (frame.type === "batch") items.push(...(frame.items as IrItem[]));
  }
  if (items.length === 0) throw new Error("Dryv compiler returned no contract items");
  return items;
}

function fieldDefinition(field: Record<string, any>, properties: Map<string, Record<string, any>>) {
  const ref = field.$ref;
  if (typeof ref !== "string" || !ref.startsWith("#/properties/")) {
    throw new Error(`Unsupported persisted field reference: ${JSON.stringify(ref)}`);
  }
  const [kind = "", ...segments] = ref.slice("#/properties/".length).split("/");
  const name = segments.join("/");
  const property = properties.get(name);
  if (!property) throw new Error(`Dryv field references missing property: ${name}`);
  if (!["primitives", "enums", "temporal"].includes(kind)) {
    throw new Error(`Unsupported database property category ${kind} (${name})`);
  }
  const definition: Record<string, unknown> = { category: kind };
  for (const key of ["type", "kind", "format", "length", "range", "ordered"]) {
    if (property[key] !== undefined) definition[key] = property[key];
  }
  if (property.values) {
    definition.values = Object.values(property.values)
      .map((entry: any) => entry.value)
      .sort((left: unknown, right: unknown) => String(left).localeCompare(String(right)));
  }
  return { name, definition };
}

export function compileDryvSchemaCatalog(): { digest: string; tables: TableContract[] } {
  const items = compile();
  const schemas = new Map<string, Record<string, any>>();
  const groups = new Map<string, Record<string, any>>();
  const properties = new Map<string, Record<string, any>>();
  for (const item of items) {
    if (item.kind === "schema") schemas.set(item.name, item.value);
    if (item.kind === "group") groups.set(item.name, item.value);
    if (item.kind.startsWith("property-")) properties.set(item.name, item.value);
  }

  const resolvedFields = new Map<string, Map<string, Record<string, any>>>();
  const resolveFields = (name: string, ancestry = new Set<string>()): Map<string, Record<string, any>> => {
    const cached = resolvedFields.get(name);
    if (cached) return cached;
    if (ancestry.has(name)) throw new Error(`Dryv entity inheritance cycle includes ${name}`);
    const schema = schemas.get(name);
    if (!schema) throw new Error(`Dryv schema reference is missing: ${name}`);
    const chain = new Set(ancestry).add(name);
    const fields = new Map<string, Record<string, any>>();
    const parentRef = schema.extends?.$ref;
    if (parentRef) {
      if (!parentRef.startsWith("#/schemas/")) throw new Error(`Unsupported schema inheritance reference on ${name}`);
      for (const [fieldName, field] of resolveFields(parentRef.slice("#/schemas/".length), chain)) fields.set(fieldName, field);
    }
    for (const [fieldName, field] of Object.entries(schema.fields ?? {})) fields.set(fieldName, field as Record<string, any>);
    resolvedFields.set(name, fields);
    return fields;
  };

  const tables: TableContract[] = [];
  for (const [name, schema] of [...schemas].sort(([a], [b]) => a.localeCompare(b))) {
    if (schema.role !== "entity" || schema.abstract) continue;
    const storage = schema.facets?.storage;
    if (storage?.kind !== "persistent" || !storage.name) {
      throw new Error(`Persistent Dryv entity ${name} has no physical table name`);
    }
    const groupName = schema.group?.$ref?.slice("#/groups/".length);
    const groupStorage = groups.get(groupName ?? "")?.facets?.storage;
    if (!groupStorage?.namespace) throw new Error(`Persistent Dryv entity ${name} has no storage namespace`);
    const columns = [...resolveFields(name)]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([fieldName, field]) => {
        const { name: type, definition } = fieldDefinition(field, properties);
        const relation = field.relation?.target?.$ref;
        return {
          name: fieldName,
          type,
          definition,
          optional: Boolean(field.optional),
          nullable: Boolean(field.nullable),
          ...(relation ? {
            relation: {
              target: relation.slice("#/schemas/".length),
              field: field.relation.target.field,
              cardinality: field.relation.cardinality,
            },
          } : {}),
        } satisfies ColumnContract;
      });
    const columnNames = new Set(columns.map(({ name: column }) => column));
    const indexes = (storage.indexes ?? []).map((index: Record<string, any>) => {
      if (!Array.isArray(index.fields) || index.fields.some((field: string) => !columnNames.has(field))) {
        throw new Error(`Index on ${name} references an absent field`);
      }
      return { name: index.name, fields: [...index.fields], unique: Boolean(index.unique) };
    }).sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));
    tables.push({
      schema: groupStorage.namespace,
      table: storage.name,
      entity: name,
      primaryKey: storage.primary_key ?? ["id"],
      columns,
      indexes,
    });
  }
  const serialized = JSON.stringify(tables);
  return { digest: createHash("sha256").update(serialized).digest("hex"), tables };
}

export async function writeDryvSchemaCatalog(): Promise<void> {
  const catalog = compileDryvSchemaCatalog();
  const body = `${JSON.stringify({ format: "mzizi.dryv-database-catalog/v1", ...catalog }, null, 2)}\n`;
  await mkdir(resolve(output, ".."), { recursive: true });
  await writeFile(output, body);
  console.log(`Generated ${catalog.tables.length} Dryv persistence contracts (${catalog.digest}) at ${output}`);
}

export async function checkDryvSchemaCatalog(): Promise<void> {
  const catalog = compileDryvSchemaCatalog();
  const expected = `${JSON.stringify({ format: "mzizi.dryv-database-catalog/v1", ...catalog }, null, 2)}\n`;
  let actual: string;
  try {
    actual = await readFile(output, "utf8");
  } catch {
    throw new Error(`Generated Dryv schema catalog is missing; run bun run db generate`);
  }
  if (actual !== expected) throw new Error(`Dryv schema catalog drift detected; review and run bun run db generate`);
  console.log(`Dryv persistence catalog is current (${catalog.tables.length} entities, ${catalog.digest})`);
}

/** Show model-to-migration table coverage before generating or applying any replacement SQL. */
export async function planDryvSchemaCoverage(): Promise<void> {
  const catalog = compileDryvSchemaCatalog();
  const migrationManifest = await readFile(resolve(repository, "source/schema/database/migrations.yaml"), "utf8");
  const migrations = [...migrationManifest.matchAll(/^\s+-\s+([\w/-]+\.sql)\s*$/gm)].map((match) => match[1]);
  if (migrations.length === 0) throw new Error("Database migration manifest contains no SQL inputs");
  const sqlTables = new Set<string>();
  for (const name of migrations) {
    if (!name || name.startsWith("/") || name.split("/").includes("..")) throw new Error(`Invalid migration path ${name}`);
    const sql = await readFile(resolve(repository, "source/schema/database", name), "utf8");
    for (const [, schema, table] of sql.matchAll(/\bCREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-z_][a-z0-9_]*)\.([a-z_][a-z0-9_]*)/gi)) {
      sqlTables.add(`${schema}.${table}`);
    }
  }
  const dryvTables = new Set(catalog.tables.map(({ schema, table }) => `${schema}.${table}`));
  const shared = [...sqlTables].filter((table) => dryvTables.has(table)).sort();
  const report = {
    status: shared.length === sqlTables.size && shared.length === dryvTables.size ? "aligned" : "reconciliation-required",
    dryvEntities: dryvTables.size,
    sqlTables: sqlTables.size,
    sameNameTables: shared.length,
    sqlOnly: [...sqlTables].filter((table) => !dryvTables.has(table)).sort(),
    dryvOnly: [...dryvTables].filter((table) => !sqlTables.has(table)).sort(),
  };
  console.log(JSON.stringify(report, null, 2));
}
