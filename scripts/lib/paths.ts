/**
 * Repository paths and local environment loading shared by every runner module.
 *
 * Nothing here spawns a process. Secrets stay in the git-ignored root `.env`; this module only reads it
 * so that services started from the root receive the same values they would get from a shell that
 * sourced the file.
 */
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

/** Absolute path of the repository root (the parent of `scripts/`). */
export const root = resolve(import.meta.dir, "..", "..");

/** Resolve a repository-relative path to an absolute one. */
export const at = (...parts: string[]): string => join(root, ...parts);

/** Turn an absolute path back into a repository-relative label for output. */
export const label = (path: string): string => (path === root ? "." : path.startsWith(`${root}/`) ? path.slice(root.length + 1) : path);

/** The local Dryv checkout. Generation uses it because the published packages lag behind the pinned engine. */
export const dryvHome = (): string =>
  process.env.DRYV_HOME ?? join(process.env.HOME ?? "", "Projects/personal/alidantech-org/codepot/dryv");

/**
 * Parse `KEY=value` lines (comments, blank lines, optional `export` and matching quotes are handled).
 * Values are returned verbatim otherwise; no variable expansion is performed.
 */
export function parseEnv(text: string): Record<string, string> {
  const values: Record<string, string> = {};
  for (const raw of text.split("\n")) {
    const line = raw.trim().replace(/^export\s+/, "");
    const split = line.indexOf("=");
    if (!line || line.startsWith("#") || split < 1) continue;
    const value = line.slice(split + 1).trim();
    const quoted = /^(["'])(.*)\1$/s.exec(value);
    values[line.slice(0, split).trim()] = quoted?.[2] ?? value;
  }
  return values;
}

/** Read the root `.env` if present. The process environment wins over the file. */
export function localEnv(): Record<string, string> {
  const file = at(".env");
  const fromFile = existsSync(file) ? parseEnv(readFileSync(file, "utf8")) : {};
  const fromProcess = Object.fromEntries(Object.entries(process.env).filter((entry): entry is [string, string] => entry[1] !== undefined));
  return { ...fromFile, ...fromProcess };
}
