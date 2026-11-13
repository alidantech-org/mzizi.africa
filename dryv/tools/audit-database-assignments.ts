/** Compile the database contracts and audit canonical store placement. Never reads a live database. */
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { auditStoreAssignments } from "./stores/audit.ts";
import { parseStoreAssignments } from "./stores/parse.ts";

const root = join(import.meta.dir, "..");
const compiled = spawnSync(
  "bun",
  [join(root, "node_modules/@dryvcode/compiler/dist/bin/dryv-ts.js"), "compile", "contracts/apps/database/index.ts"],
  {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
  },
);
if (compiled.status !== 0) throw new Error(`database authoring failed: ${compiled.stderr || compiled.stdout}`);
const result = auditStoreAssignments(parseStoreAssignments(compiled.stdout));
if (result.problems.length) throw new Error(`Canonical store assignment errors:\n${result.problems.join("\n")}`);
console.log(
  `Canonical stores: ${[...result.tables]
    .map(([store, count]) => `${store}=${count} tables`)
    .sort()
    .join(", ")}`,
);
