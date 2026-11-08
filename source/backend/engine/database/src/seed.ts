/**
 * Seed registry CLI (source/backend/engine/database). Reads the repository-root seed/ directory.
 *
 *   bun src/seed.ts check     validate folder metadata, manifest, dependencies, consumers and the lock (no writes)
 *   bun src/seed.ts lock      regenerate seed/manifest.lock.json (checksums, effective metadata, S3 key mappings)
 *   bun src/seed.ts report    effective metadata per artifact, grouped by folder (for review)
 *
 * Nothing here uploads to S3 or writes to a database; upload and registration belong to the filesystem milestone.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { seedRoot } from "./config.ts";
import { artifactFiles, buildLock, resolveEffective, validateManifest } from "./seed-manifest.ts";

const lockPath = join(seedRoot, "manifest.lock.json");
const [command] = process.argv.slice(2);

if (command === "lock") {
  const { errors, manifest } = validateManifest();
  if (errors.length || !manifest) {
    console.error(errors.join("\n"));
    process.exit(1);
  }
  writeFileSync(lockPath, JSON.stringify(buildLock(manifest), null, 2) + "\n");
  console.log(`wrote ${lockPath}`);
} else if (command === "check") {
  const { errors, warnings, manifest } = validateManifest();
  if (manifest && !errors.length) {
    const expected = JSON.stringify(buildLock(manifest), null, 2) + "\n";
    let actual = "";
    try {
      actual = readFileSync(lockPath, "utf8");
    } catch {
      /* missing */
    }
    if (actual !== expected) errors.push("manifest.lock.json is missing or stale: run `bun src/seed.ts lock`");
  }
  console.log(`${manifest?.entries.length ?? 0} entries, ${warnings.length} classification warnings`);
  for (const warning of warnings) console.log(`warning: ${warning}`);
  for (const error of errors) console.error(`error: ${error}`);
  process.exit(errors.length ? 1 : 0);
} else if (command === "report") {
  for (const file of artifactFiles()) {
    const { effective, errors } = resolveEffective(file);
    console.log(effective ? `${file}\t${effective.role}\t${effective.acquisition_class}\t${effective.preparation}\t${effective.access}\t${effective.review?.status ?? "-"}` : `${file}\tERROR ${errors.join("; ")}`);
  }
} else {
  console.error("usage: bun src/seed.ts check | lock | report");
  process.exit(2);
}
