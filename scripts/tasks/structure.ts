/**
 * Structure and size rules for hand-written code (`bun run structure`).
 *
 * Applies to code people maintain by hand: the Python packages and engine, the root scripts and the Dryv
 * contracts and tools. Dryv-managed output under source/backend/api is excluded because Dryv owns its shape.
 *
 * Rules:
 * 1. Every Python project has `pyproject.toml`, `README.md`, `tests/` and exactly one `src/mzizi_*` package
 *    with `__init__.py` and `py.typed`; no Python files sit loose in the project root.
 * 2. Every Python source module starts with a docstring and every TypeScript script or tool with a comment
 *    that says what the file is for.
 * 3. No file exceeds its hard line limit (see `limits`). Split a file by responsibility instead of raising a limit.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { at, label } from "../lib/paths.ts";

/** A hard line limit for the files under `dir` whose path matches `match`. The first matching rule wins. */
export type Limit = { readonly dir: string; readonly match: RegExp; readonly lines: number; readonly needsHeader: boolean };

export const limits: readonly Limit[] = [
  { dir: "source/packages", match: /\/tests\/.*\.py$/, lines: 600, needsHeader: false },
  { dir: "source/backend/engine", match: /\/tests\/.*\.py$/, lines: 600, needsHeader: false },
  { dir: "source/packages", match: /\.py$/, lines: 400, needsHeader: true },
  { dir: "source/backend/engine", match: /\.py$/, lines: 400, needsHeader: true },
  { dir: "scripts", match: /\.py$/, lines: 400, needsHeader: true },
  { dir: "scripts", match: /\.test\.ts$/, lines: 600, needsHeader: false },
  { dir: "scripts", match: /\.ts$/, lines: 400, needsHeader: true },
  { dir: "dryv/tools", match: /\.ts$/, lines: 400, needsHeader: true },
  { dir: "dryv/contracts", match: /\.ts$/, lines: 800, needsHeader: false },
];

const skipped = new Set(["node_modules", ".venv", "__pycache__", ".dryv", "staging"]);

/** Every file under `dir`, skipping dependency and cache directories and `*.egg-info`. */
export function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (skipped.has(name) || name.endsWith(".egg-info")) return [];
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

/** Number of lines in a text (a trailing newline does not count as an extra line). */
export const lineCount = (text: string): number => (text.length === 0 ? 0 : text.replace(/\n$/, "").split("\n").length);

/** True when a source file opens with a docstring (Python) or a comment (TypeScript), after any shebang. */
export function hasHeader(path: string, text: string): boolean {
  const body = text.replace(/^#!.*\n/, "").trimStart();
  if (body.length === 0) return true;
  return path.endsWith(".py") ? /^[rRbBuU]{0,2}("""|''')/.test(body) : body.startsWith("/**") || body.startsWith("//");
}

/** Problems with one file's size or header, as printable messages. */
export function fileProblems(path: string, text: string, limit: Limit): string[] {
  const problems: string[] = [];
  const lines = lineCount(text);
  if (lines > limit.lines) problems.push(`${label(path)}: ${lines} lines exceeds the limit of ${limit.lines}`);
  if (limit.needsHeader && !hasHeader(path, text))
    problems.push(`${label(path)}: missing a leading docstring or comment that says what the file is for`);
  return problems;
}

/** Layout problems of one Python project directory. */
export function pythonLayoutProblems(dir: string): string[] {
  const problems: string[] = [];
  const name = label(dir);
  for (const required of ["pyproject.toml", "README.md", "src", "tests"])
    if (!existsSync(join(dir, required))) problems.push(`${name}: missing ${required}`);
  for (const loose of readdirSync(dir).filter((entry) => entry.endsWith(".py")))
    problems.push(`${name}/${loose}: Python files belong in src/ or tests/`);
  const source = join(dir, "src");
  if (!existsSync(source)) return problems;
  const packages = readdirSync(source).filter((entry) => !entry.endsWith(".egg-info") && statSync(join(source, entry)).isDirectory());
  if (packages.length !== 1 || !packages[0]?.startsWith("mzizi_"))
    problems.push(`${name}/src: expected exactly one package named mzizi_*, found ${packages.join(", ") || "none"}`);
  for (const pkg of packages)
    for (const required of ["__init__.py", "py.typed"])
      if (!existsSync(join(source, pkg, required))) problems.push(`${name}/src/${pkg}: missing ${required}`);
  return problems;
}

/** The Python project directories: every package and the engine. */
export function pythonProjects(): string[] {
  const packages = at("source/packages");
  const found = readdirSync(packages)
    .map((entry) => join(packages, entry))
    .filter((path) => statSync(path).isDirectory());
  return [...found, at("source/backend/engine")];
}

/** Run every rule and print the result. Returns true when the repository conforms. */
export function checkStructure(): boolean {
  const problems = pythonProjects().flatMap(pythonLayoutProblems);
  const seen = new Set<string>();
  let checked = 0;
  for (const limit of limits) {
    for (const path of walk(at(limit.dir))) {
      if (seen.has(path) || !limit.match.test(path)) continue;
      seen.add(path);
      checked++;
      problems.push(...fileProblems(path, readFileSync(path, "utf8"), limit));
    }
  }
  for (const problem of problems) console.error(`✖ ${problem}`);
  console.log(problems.length ? `structure: ${problems.length} problem(s) in ${checked} files` : `structure: ${checked} files conform`);
  return problems.length === 0;
}
