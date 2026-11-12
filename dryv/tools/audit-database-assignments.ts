/**
 * Drift guard for the schema-to-database catalogue.
 *
 * `contracts/apps/database/persistence.ts` is the canonical namespace -> database catalogue; the
 * `rust-sql` pack activation in `dryv.yaml` carries the same lists as pack inputs (packs cannot read
 * TypeScript). This fails when the two disagree, so a namespace can never be assigned in one place
 * and unassigned in the other.
 *
 *   bun tools/audit-database-assignments.ts
 */
import { join } from "node:path";

import { databaseAssignments } from "../contracts/apps/database/persistence.ts";

const root = join(import.meta.dir, "..", "..");
const config = Bun.YAML.parse(await Bun.file(join(root, "dryv.yaml")).text()) as {
  packs?: Record<string, { inputs?: Record<string, unknown> }>;
};
const lists: Record<string, string> = { main_namespaces: "mzizi", operations_namespaces: "mzizi_operations" };

const problems: string[] = [];
const seen = new Map<string, string>();
for (const [pack, input, database] of Object.keys(config.packs ?? {})
  .filter((name) => name.startsWith("rust-"))
  .flatMap((pack) => Object.entries(lists).map(([input, database]) => [pack, input, database] as const))) {
  const value = config.packs?.[pack]?.inputs?.[input];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    problems.push(`dryv.yaml packs.${pack}.inputs.${input} must be a list of namespaces`);
    continue;
  }
  const names = value as string[];
  if (new Set(names).size !== names.length) problems.push(`${input} lists a namespace twice`);
  for (const namespace of names) {
    const previous = seen.get(`${pack}:${namespace}`);
    if (previous) problems.push(`namespace ${namespace} is in both ${previous} and ${input}`);
    seen.set(`${pack}:${namespace}`, input);
    const assigned = databaseAssignments[namespace];
    if (assigned === undefined) problems.push(`${input} lists ${namespace}, which persistence.ts does not assign`);
    else if (assigned !== database) problems.push(`${namespace} is ${assigned} in persistence.ts but listed in ${input} (${database})`);
  }
}
for (const [namespace, database] of Object.entries(databaseAssignments)) {
  if (!seen.has(`rust-sql:${namespace}`) || !seen.has(`rust-models:${namespace}`))
    problems.push(`persistence.ts assigns ${namespace} to ${database} but dryv.yaml does not list it`);
}

if (problems.length > 0) {
  console.error(`Database assignment drift:\n- ${problems.join("\n- ")}`);
  process.exit(1);
}
console.log(`database assignments consistent (${Object.keys(databaseAssignments).length} namespaces, both packs)`);
