/** Prints every declared wording as JSON for the database seed: `bun source/sdk/copy/src/export.ts`. */
import { areas, flatten } from "./index.ts";

const rows = areas.flatMap((a) => flatten(a.area, a.tree));
const keys = new Set<string>();
for (const r of rows) {
  if (keys.has(r.key)) throw new Error(`Duplicate copy key ${r.key}`);
  keys.add(r.key);
  const need = (t: string) => [...t.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");
  if (need(r.en) !== need(r.sw)) throw new Error(`${r.key}: English and Swahili use different parameters`);
}
console.log(JSON.stringify(rows));
