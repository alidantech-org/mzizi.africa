/**
 * Import-boundary report (`bun run boundaries`).
 *
 * Measures the rules of .docs/design/architecture/ENGINE_RUNTIME_AND_PACKAGES.md in hand-written Python:
 * packages never import the engine or a database driver, the engine imports no capability library and no
 * database driver outside generated code, and neither the packages nor the engine keep loose modules in their
 * package root. It only reports; `--strict` makes any remaining violation a failure, to be switched on once the
 * engine restructure has removed them. Dryv-generated routes under the engine's `api/` folder are skipped.
 */
import { readFileSync } from "node:fs";
import { label } from "../lib/paths.ts";
import { pythonProjects, walk } from "./structure.ts";

/** Database drivers: no package may know a database exists, and the engine reaches databases through generated code. */
export const databaseDrivers: ReadonlySet<string> = new Set([
  "psycopg",
  "psycopg2",
  "asyncpg",
  "sqlalchemy",
  "pymongo",
  "motor",
  "qdrant_client",
]);

/** Libraries that implement a capability (browser, HTML, imaging, terminal UI); they belong in packages, not the engine. */
export const capabilityLibraries: ReadonlySet<string> = new Set([
  "playwright",
  "bs4",
  "soupsieve",
  "PIL",
  "tldextract",
  "typer",
  "rich",
  "questionary",
]);

export type Area = "package" | "engine";

/** Front doors call the engine runtime, so they may import `mzizi_engine`. The engine must never import them. */
const frontDoors = ["source/packages/cli/"];

export type RuleId =
  | "package-imports-engine"
  | "package-imports-database"
  | "engine-imports-database"
  | "engine-imports-capability"
  | "package-root-module"
  | "engine-root-module";

export type Violation = {
  readonly rule: RuleId;
  readonly file: string;
  readonly line: number;
  /** The imported module, or the module file name for root-module rules. */
  readonly subject: string;
};

/** What each rule protects, printed above its violations. */
export const ruleSummaries: Readonly<Record<RuleId, string>> = {
  "package-imports-engine": "a package imports mzizi_engine; only front doors (the CLI) may, and only its runtime",
  "package-imports-database": "a package imports a database driver; packages never know a database exists",
  "engine-imports-database": "the engine imports a database driver; persistence must be Dryv-generated code",
  "engine-imports-capability": "the engine imports a capability library; capabilities live in packages",
  "package-root-module": "a package root holds a module; roots hold only __init__.py and folders",
  "engine-root-module": "the engine root holds a module; the engine keeps one runtime, not loose modules",
};

const ruleOrder = Object.keys(ruleSummaries) as RuleId[];

type Import = { readonly module: string; readonly line: number };

/** Every module a Python source imports, including `importlib.import_module("name")` string imports. */
export function importedModules(text: string): Import[] {
  const found: Import[] = [];
  text.split("\n").forEach((raw, index) => {
    const line = index + 1;
    const from = /^\s*from\s+([A-Za-z_][\w.]*)\s+import\b/.exec(raw);
    if (from?.[1]) found.push({ module: from[1], line });
    const plain = /^\s*import\s+([A-Za-z_][\w.]*(?:\s+as\s+\w+)?(?:\s*,\s*[A-Za-z_][\w.]*(?:\s+as\s+\w+)?)*)\s*$/.exec(raw);
    if (plain?.[1])
      for (const part of plain[1].split(",")) {
        const name = part.trim().split(/\s+as\s+/)[0];
        if (name) found.push({ module: name, line });
      }
    for (const dynamic of raw.matchAll(/importlib\.import_module\(\s*["']([A-Za-z_][\w.]*)["']/g))
      if (dynamic[1]) found.push({ module: dynamic[1], line });
  });
  return found;
}

const topLevel = (module: string): string => module.split(".")[0] ?? module;

/** Violations of one file. `path` is repository-relative with forward slashes. */
export function scanFile(path: string, text: string, area: Area): Violation[] {
  const found: Violation[] = [];
  const add = (rule: RuleId, line: number, subject: string): void => void found.push({ rule, file: path, line, subject });
  for (const { module, line } of importedModules(text)) {
    const root = topLevel(module);
    if (area === "package") {
      if (root === "mzizi_engine" && !frontDoors.some((prefix) => path.startsWith(prefix)))
        add("package-imports-engine", line, module);
      if (databaseDrivers.has(root)) add("package-imports-database", line, module);
    } else {
      if (databaseDrivers.has(root)) add("engine-imports-database", line, module);
      if (capabilityLibraries.has(root)) add("engine-imports-capability", line, module);
    }
  }
  const parts = path.split("/");
  const name = parts[parts.length - 1] ?? path;
  const looseInPackage = area === "package" && parts.length === 6 && parts[3] === "src" ? name : undefined;
  const looseInEngine = area === "engine" && parts.length === 6 && parts[3] === "src" ? name : undefined;
  if (looseInPackage && looseInPackage !== "__init__.py") add("package-root-module", 1, looseInPackage);
  if (looseInEngine && looseInEngine !== "__init__.py") add("engine-root-module", 1, looseInEngine);
  return found;
}

/** Group violations by rule in a fixed order, as printable lines. */
export function formatReport(violations: readonly Violation[]): string[] {
  const lines: string[] = [];
  for (const rule of ruleOrder) {
    const hits = violations.filter((violation) => violation.rule === rule);
    lines.push(`${rule}: ${hits.length}  (${ruleSummaries[rule]})`);
    for (const hit of hits) lines.push(`  ${hit.file}:${hit.line}  ${hit.subject}`);
  }
  lines.push(`total: ${violations.length}`);
  return lines;
}

/** Scan every hand-written Python source in the packages and the engine (tests and generated routes excluded). */
export function scanRepository(): Violation[] {
  const generated = "source/backend/engine/src/mzizi_engine/api/";
  return pythonProjects().flatMap((dir) =>
    walk(`${dir}/src`)
      .filter((path) => path.endsWith(".py") && !label(path).startsWith(generated))
      .flatMap((path) =>
        scanFile(label(path), readFileSync(path, "utf8"), label(dir).startsWith("source/packages") ? "package" : "engine"),
      ),
  );
}

/** Print the report; fail only with `--strict` and at least one violation. */
export function checkBoundaries(strict: boolean): boolean {
  const violations = scanRepository();
  for (const line of formatReport(violations)) console.log(line);
  if (violations.length > 0 && !strict) console.log("report only: pass --strict to fail on violations");
  return !strict || violations.length === 0;
}
