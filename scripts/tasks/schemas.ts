/**
 * Keep `source/schema/` current and published with one command.
 *
 *   bun run schemas:sync                regenerate, check, then upload the changed schemas
 *   bun run schemas:sync -- --local     regenerate and check only (no upload)
 *   bun run schemas:sync -- --dry-run   regenerate, check and list the keys that would be uploaded
 *   bun run schemas:sync -- --no-dryv   skip the Dryv generation (the table schemas and catalogs)
 *
 * Generated schemas: the table schemas under `source/schema/database/` (Dryv) and `engine/job.schema.json` (the typed job
 * model). Hand-written schemas are only checked and uploaded. Publishing needs the S3 settings in the root `.env`.
 */
import { group, step } from "../lib/exec.ts";
import { root } from "../lib/paths.ts";
import * as dryv from "./dryv.ts";

const FLAGS = new Set(["--local", "--dry-run", "--no-dryv"]);

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
  return group(dryRun ? "publish (dry run)" : "publish", [publish]);
}
