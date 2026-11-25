/**
 * Derives `SubjectTable` (dryv/contracts/schemas/_subjects.ts) and `source/schema/codes.json` from the generated schema.
 *
 *   bun tools/sync-tables.ts --check   fail when either file disagrees with the generated tables
 *   bun tools/sync-tables.ts           rewrite both files
 *
 * Existing entries are kept as they are (hand-chosen `short` names, `kind`, `parent`, enum member names and order); a new table
 * is appended with a deterministic short: the first three letters of its name, unique within its schema (extended with a digit
 * on a clash). A table that no longer exists is removed. Audit and auth tables are operational and never subjects.
 */
import { resolve } from "node:path";

const repo = resolve(import.meta.dir, "../..");
const snapshot = await Bun.file(resolve(repo, "source/backend/database/sql/schema.sql")).text();
const subjectsPath = resolve(repo, "dryv/contracts/schemas/_subjects.ts");
const codesPath = resolve(repo, "source/schema/codes.json");

// Partitions (`CREATE TABLE ... PARTITION OF ...`) are storage of their parent table, not tables of their own.
const tables = [...snapshot.matchAll(/CREATE TABLE "([a-z_]+)"\."([a-z_]+)"(?! PARTITION OF)/g)]
  .map((m) => `${m[1]}.${m[2]}`)
  .sort();
const pascal = (text: string): string =>
  text
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

/** The first three letters of a name, with a digit appended until it is unique among `taken`. */
export function deterministicShort(name: string, taken: ReadonlySet<string>): string {
  const base = name.replace(/[^a-z]/g, "").slice(0, 3);
  if (!taken.has(base)) return base;
  for (let n = 2; ; n++) {
    const candidate = `${base.slice(0, 2)}${n}`;
    if (!taken.has(candidate)) return candidate;
  }
}

interface TableEntry {
  short: string;
  [key: string]: unknown;
}
interface Codes {
  schemas: Record<string, string>;
  tables: Record<string, TableEntry>;
  [key: string]: unknown;
}

const codes = JSON.parse(await Bun.file(codesPath).text()) as Codes;
const nextCodes: Codes = { ...codes, schemas: { ...codes.schemas }, tables: {} };
for (const [name, entry] of Object.entries(codes.tables)) if (tables.includes(name)) nextCodes.tables[name] = entry;
for (const table of tables) {
  const [schema = "", name = ""] = table.split(".");
  if (!(schema in nextCodes.schemas))
    nextCodes.schemas[schema] = deterministicShort(schema, new Set(Object.values(nextCodes.schemas)));
  if (table in nextCodes.tables) continue;
  const taken = new Set(
    Object.entries(nextCodes.tables)
      .filter(([t]) => t.startsWith(`${schema}.`))
      .map(([, e]) => e.short),
  );
  nextCodes.tables[table] = { short: deterministicShort(name, taken) };
}
const codesText = `${JSON.stringify(nextCodes, null, 2)}\n`;

const subjects = await Bun.file(subjectsPath).text();
const block = /(SubjectTable: dryv\.property\.enum\(\{\n)([\s\S]*?)(\n  \}\),)/.exec(subjects);
if (!block) throw new Error("SubjectTable enum not found in _subjects.ts");
const existing = [...(block[2] ?? "").matchAll(/^\s+([A-Za-z]+): "([a-z_]+\.[a-z_]+)",$/gm)].map(
  (m) => [m[1] as string, m[2] as string] as const,
);
const eligible = tables.filter((t) => !t.startsWith("audit.") && !t.startsWith("auth."));
const members = existing.filter(([, t]) => eligible.includes(t));
for (const table of eligible)
  if (!members.some(([, t]) => t === table)) {
    const [schema = "", name = ""] = table.split(".");
    members.push([`${pascal(schema)}${pascal(name)}`, table]);
  }
const subjectsText = subjects.replace(
  block[0],
  `${block[1]}${members.map(([k, t]) => `    ${k}: "${t}",`).join("\n")}${block[3]}`,
);

const currentCodes = await Bun.file(codesPath).text();
if (process.argv.includes("--check")) {
  const errors: string[] = [];
  if (currentCodes !== codesText) errors.push("source/schema/codes.json is out of sync with the generated tables");
  if (subjects !== subjectsText) errors.push("SubjectTable in _subjects.ts is out of sync with the generated tables");
  if (errors.length) {
    console.error(`${errors.join("\n")}\nrun \`bun dryv/tools/sync-tables.ts\``);
    process.exit(1);
  }
  console.log(`codes.json and SubjectTable cover ${tables.length} tables`);
} else {
  await Bun.write(codesPath, codesText);
  await Bun.write(subjectsPath, subjectsText);
  console.log(`synced ${tables.length} tables (${eligible.length} subjects)`);
}
