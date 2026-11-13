/**
 * Installation, health and cleanup: `setup`, `sync`, `doctor` and `clean`.
 *
 * `sync` installs dependencies exactly as locked (uv.lock, each bun.lock). `setup` is `sync` plus the
 * one-time local preparation: linking the Dryv checkout and creating the development sign-in keys.
 */
import { existsSync, rmSync } from "node:fs";
import { has, type Step, step } from "../lib/exec.ts";
import { at, dryvHome, root } from "../lib/paths.ts";
import type { Project } from "../lib/projects.ts";

/** Dependency installation for the selected projects. */
export function syncSteps(selected: readonly Project[]): Step[] {
  return selected.flatMap((project) => {
    const cwd = at(project.dir);
    if (project.kind === "python") return [step("uv sync", root, ["uv", "sync", "--all-packages"])];
    if (project.kind === "flutter") return has("flutter") ? [step("flutter pub get", cwd, ["flutter", "pub", "get"])] : [];
    return [step("bun install", cwd, ["bun", "install"])];
  });
}

/** One-time local preparation that follows dependency installation. */
export function prepareSteps(): Step[] {
  return [
    step("Link local Dryv checkout", at("dryv"), ["bun", "run", "link"], { DRYV_HOME: dryvHome() }),
    step("Development sign-in keys", at("source/apps/web"), ["bun", "run", "dev:env"]),
  ];
}

/** Report the tools and local files the commands rely on. Returns false when something required is missing. */
export function doctor(): boolean {
  const required = ["bun", "uv"];
  const optional = ["docker", "flutter", "task", "fuser"];
  let ok = true;
  for (const tool of required) {
    const path = Bun.which(tool);
    ok &&= path !== null;
    console.log(`${path ? "✔" : "✖"} ${tool.padEnd(8)} ${path ?? "missing (required)"}`);
  }
  for (const tool of optional) console.log(`${Bun.which(tool) ? "✔" : "–"} ${tool.padEnd(8)} ${Bun.which(tool) ?? "not installed (optional)"}`);
  const files: readonly (readonly [string, string, boolean])[] = [
    [".env", "local environment for dev and start (git-ignored)", false],
    [".venv", "Python environment: run `bun run sync`", true],
    ["dryv/node_modules/@dryvcode/author", "Dryv link: run `bun run dryv:link`", true],
    ["source/backend/api/node_modules", "API dependencies: run `bun run sync`", true],
    [".local/secure/dev-auth/public.pem", "development sign-in keys: run `bun run setup`", false],
  ];
  for (const [path, hint, needed] of files) {
    const present = existsSync(at(path));
    if (needed) ok &&= present;
    console.log(`${present ? "✔" : needed ? "✖" : "–"} ${path.padEnd(38)} ${present ? "" : hint}`);
  }
  const dryv = existsSync(dryvHome());
  console.log(`${dryv ? "✔" : "–"} DRYV_HOME ${dryvHome()}${dryv ? "" : " (missing: Dryv commands will fail; set DRYV_HOME)"}`);
  return ok;
}

/** Caches and build output that are safe to delete; dependencies and `.local/secure` are never touched. */
const disposable = [
  ".ruff_cache",
  ".mypy_cache",
  ".pytest_cache",
  ".local/dist",
  "source/apps/web/.next",
  "source/apps/www/.next",
  "source/apps/mobile/build",
];

/** Delete caches and build output, and optionally (`deep`) every dependency directory. */
export function clean(deep: boolean): void {
  const dependencies = [
    ".venv",
    "node_modules",
    "dryv/node_modules",
    "source/backend/api/node_modules",
    "source/apps/web/node_modules",
    "source/apps/www/node_modules",
  ];
  for (const path of [...disposable, ...(deep ? dependencies : [])]) {
    if (!existsSync(at(path))) continue;
    rmSync(at(path), { recursive: true, force: true });
    console.log(`removed ${path}`);
  }
  const caches = Bun.spawnSync(["find", "source", "scripts", "-name", "__pycache__", "-type", "d", "-prune", "-exec", "rm", "-rf", "{}", "+"], {
    cwd: root,
  });
  if (caches.exitCode === 0) console.log("removed __pycache__ directories");
}
