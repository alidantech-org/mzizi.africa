/**
 * Confirms generated output is current: asks the local Dryv API for a plan and fails when it would
 * create, modify or delete anything. Run after `dryv generate`; requires the Dryv API.
 *
 *   DRYV_API=http://127.0.0.1:8750 DRYV_HOME=... bun tools/check-generated.ts
 */
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const repo = join(import.meta.dir, "..", "..");
const dryvHome = process.env.DRYV_HOME ?? `${process.env.HOME}/Projects/personal/alidantech-org/codepot/dryv`;
const api = process.env.DRYV_API ?? "http://127.0.0.1:8750";

const plan = spawnSync("bun", [join(dryvHome, "source/apps/cli/bin/dryv.ts"), "--api", api, "--yes", "--no-input", "plan"], {
  cwd: repo,
  encoding: "utf8",
});
const output = `${plan.stdout}${plan.stderr}`;
if (plan.status !== 0) {
  console.error(output);
  process.exit(1);
}
const changes = output.match(/Changes:\s*(\d+) create\s+(\d+) modify\s+(\d+) delete/);
if (changes && changes.slice(1).some((count) => Number(count) > 0)) {
  console.error(`Generated output is stale: ${changes[0]}. Run dryv generate and commit the result.`);
  process.exit(1);
}
console.log("Generated output is current");
