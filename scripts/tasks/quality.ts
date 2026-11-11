/**
 * Quality steps (format, lint, typecheck, test, build) for the selected projects.
 *
 * - The Python workspace is checked once from the root with ruff, mypy and pytest (configured in the root pyproject.toml).
 * - The root scripts and the hand-written Dryv tooling are checked with Biome, tsc and `bun test`.
 * - Every other Bun project is delegated to its own package.json script when it defines one, so each project
 *   stays runnable on its own and the root never duplicates its configuration.
 * - Dryv-generated API code is formatted by Dryv actions during generation and is not reformatted here.
 */
import { has, type Step, step } from "../lib/exec.ts";
import { at, root } from "../lib/paths.ts";
import { type Project, packageScripts, pythonPaths } from "../lib/projects.ts";

export type QualityKind = "format" | "format:check" | "lint" | "lint:fix" | "typecheck" | "test" | "build";

const biome = (...args: string[]): string[] => ["bun", "x", "biome", ...args];

/** Commands for the Python workspace. */
function python(kind: QualityKind): Step[] {
  const ruff = (title: string, ...args: string[]): Step => step(title, root, ["uv", "run", "ruff", ...args, ...pythonPaths]);
  switch (kind) {
    case "format":
      return [ruff("Ruff format", "format")];
    case "format:check":
      return [ruff("Ruff format check", "format", "--check")];
    case "lint":
      return [ruff("Ruff lint", "check")];
    case "lint:fix":
      return [ruff("Ruff lint fix", "check", "--fix")];
    case "typecheck":
      return [step("mypy", root, ["uv", "run", "mypy"])];
    case "test":
      return [step("pytest", root, ["uv", "run", "pytest", "source", "-q"])];
    case "build":
      return [step("Build wheels", root, ["uv", "build", "--all-packages", "--out-dir", ".local/dist"])];
  }
}

/** Commands for the root scripts and Dryv tooling, which have no package.json scripts of their own to delegate to. */
function rootScripts(kind: QualityKind): Step[] {
  switch (kind) {
    case "format":
      return [step("Biome format", root, biome("format", "--write"))];
    case "format:check":
      return [step("Biome format check", root, biome("format"))];
    case "lint":
      return [step("Biome lint", root, biome("lint"))];
    case "lint:fix":
      return [step("Biome lint fix", root, biome("lint", "--write"))];
    case "typecheck":
      return [step("tsc", root, ["bun", "x", "tsc", "--noEmit", "-p", "tsconfig.json"])];
    case "test":
      return [step("bun test", root, ["bun", "test", "scripts"])];
    case "build":
      return [];
  }
}

/** Delegate to the project's own package.json script, if it has one of that name. */
function delegated(project: Project, kind: QualityKind): Step[] {
  return packageScripts(project).has(kind) ? [step(kind, at(project.dir), ["bun", "run", kind])] : [];
}

/** Commands for the Flutter app. Skipped with a notice when the SDK is absent. */
function flutter(project: Project, kind: QualityKind): Step[] {
  if (!has("flutter")) {
    console.warn(`flutter is not installed; skipping ${project.name}`);
    return [];
  }
  const cwd = at(project.dir);
  switch (kind) {
    case "format":
      return [step("dart format", cwd, ["dart", "format", "lib", "test"])];
    case "format:check":
      return [step("dart format check", cwd, ["dart", "format", "--set-exit-if-changed", "--output=none", "lib", "test"])];
    case "lint":
    case "typecheck":
      return [step("flutter analyze", cwd, ["flutter", "analyze"])];
    case "lint:fix":
      return [step("dart fix", cwd, ["dart", "fix", "--apply"])];
    case "test":
      return [step("flutter test", cwd, ["flutter", "test"])];
    case "build":
      return [step("flutter build web", cwd, ["flutter", "build", "web"])];
  }
}

/** Every step of one kind for the selected projects, in registry order. */
export function qualitySteps(kind: QualityKind, selected: readonly Project[]): Step[] {
  return selected.flatMap((project) => {
    if (project.kind === "python") return python(kind);
    if (project.kind === "flutter") return flutter(project, kind);
    return project.name === "scripts" ? rootScripts(kind) : delegated(project, kind);
  });
}
