/**
 * Keep `source/schema/` current and published with one command.
 *
 *   bun run schemas:sync                regenerate, check, then upload the changed schemas
 *   bun run schemas:sync -- --local     regenerate and check only (no upload)
 *   bun run schemas:sync -- --dry-run   regenerate, check and list the keys that would be uploaded
 *   bun run schemas:sync -- --no-dryv   skip the Dryv generation (the table schemas and catalogs)
 *   bun run schemas:sync -- --prune     also delete public schema objects no schema file produces any more
 *
 * Generated schemas: the table schemas under `source/schema/database/` (Dryv), `engine/job.schema.json` (the typed job
 * model) and `vocabulary/web.schema.json` (the typed web vocabulary). Hand-written schemas are only checked and uploaded. Publishing needs the S3 settings in the root `.env`.
 */
import { existsSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { group, step } from "../lib/exec.ts";
import { root } from "../lib/paths.ts";
import * as dryv from "./dryv.ts";

const FLAGS = new Set(["--local", "--dry-run", "--no-dryv", "--prune"]);

export async function syncSchemas(args: readonly string[]): Promise<boolean> {
  const unknown = args.filter((arg) => !FLAGS.has(arg));
  if (unknown.length)
    throw new Error(
      `unknown option ${unknown.join(", ")}; use ${[...FLAGS].join(", ")}`,
    );
  const local = args.includes("--local");
  const dryRun = args.includes("--dry-run");

  if (!args.includes("--no-dryv") && !(await dryv.catalog())) return false;

  const generate = step(
    "job schema",
    root,
    [
      "uv",
      "run",
      "pytest",
      "source/backend/engine/tests/runs/test_job_schema.py",
      "source/packages/fetch/tests/test_web_core.py",
      "-q",
    ],
    { MZIZI_WRITE_SCHEMAS: "1" },
  );
  const check = step("schema checks", root, [
    "uv",
    "run",
    "pytest",
    "source/packages/manifest/tests/test_schemas.py",
    "source/packages/manifest/tests/test_examples.py",
    "source/backend/engine/tests/runs/test_job_schema.py",
    "source/packages/fetch/tests/test_web_core.py",
    "-q",
  ]);
  if (
    !(await group("generate", [generate])) ||
    !(await group("check", [check]))
  )
    return false;
  if (local) return true;
  const publish = step("publish schemas", root, [
    "uv",
    "run",
    "mzizi-engine",
    "publish-schemas",
    ...(dryRun ? ["--dry-run"] : []),
  ]);
  const published = await group(dryRun ? "publish (dry run)" : "publish", [
    publish,
  ]);
  if (published && !dryRun)
    console.log(
      "\nEditors cache schemas: run `bun run schemas:forget-cache`, then reload the editor window.",
    );
  return published;
}

const PUBLIC_BASE = "https://res.alidantech.org/mzizi/public/schemas/";

/** Folders where the Red Hat YAML extension keeps downloaded schemas on disk (it never refetches a cached URL). */
const yamlCaches = (): string[] => {
  const config = process.env.XDG_CONFIG_HOME ?? join(homedir(), ".config");
  return [
    join(
      config,
      "Code",
      "User",
      "globalStorage",
      "redhat.vscode-yaml",
      "schemas_cache",
    ),
    join(
      homedir(),
      "Library",
      "Application Support",
      "Code",
      "User",
      "globalStorage",
      "redhat.vscode-yaml",
      "schemas_cache",
    ),
  ];
};

/**
 * Delete the editor's cached copies of our published schemas, so the next open downloads the current ones. Only cache files
 * whose `$id` is under the public schema URL are removed; the cache is re-created on demand. The JSON extension keeps its
 * copies in memory: run "JSON: Clear Schema Cache" and "Developer: Reload Window" in the editor too.
 */
export function forgetEditorCache(): boolean {
  let removed = 0;
  for (const folder of yamlCaches().filter(existsSync)) {
    for (const name of readdirSync(folder)) {
      const file = join(folder, name);
      try {
        const id = (JSON.parse(readFileSync(file, "utf8")) as { $id?: unknown })
          .$id;
        if (typeof id === "string" && id.startsWith(PUBLIC_BASE)) {
          rmSync(file);
          removed += 1;
        }
      } catch {
        // not a JSON schema file: leave it
      }
    }
  }
  console.log(
    `removed ${removed} cached schema file(s) from the YAML extension`,
  );
  console.log(
    'In the editor: run "JSON: Clear Schema Cache", then "Developer: Reload Window".',
  );
  return true;
}
