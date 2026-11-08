/**
 * Dryv scaffolds each Find* use case once with its own paging and filter code. This idempotent tool
 * rewrites any scaffold that has not adopted the shared helper (source/apps/api/src/read/list-page.ts)
 * so every list shares bounded paging, q search, current-only default and deterministic order.
 *
 *   bun dryv/tools/adopt-list-page.ts
 */
import { Glob } from "bun";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const api = join(import.meta.dir, "..", "..", "source/apps/api");
let adopted = 0;
for await (const file of new Glob("src/modules/*/*/use-cases/find-*.usecase.ts").scan({ cwd: api, absolute: true })) {
  const source = readFileSync(file, "utf8");
  if (source.includes("listPage")) continue;
  const method = source.match(/  async execute\((.*?)\): Promise<(.*?)> \{\n[\s\S]*?\n  \}\n\}\s*$/);
  const key = source.match(/(\w+): rows\.map/);
  if (!method || !key) {
    console.error(`cannot adopt ${file}: unexpected scaffold shape`);
    process.exitCode = 1;
    continue;
  }
  const replacement = `  async execute(${method[1]}): Promise<${method[2]}> {
    const { rows, meta } = await listPage(this.repository, input);
    return { ${key[1]}: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as ${method[2]};
  }
}
`;
  let next = source.slice(0, method.index) + replacement;
  const at = next.indexOf("\n\n/**");
  next = `${next.slice(0, at)}\nimport { listPage } from '#/read/list-page';${next.slice(at)}`;
  writeFileSync(file, next);
  adopted += 1;
}
console.log(`Adopted the shared list helper in ${adopted} use case(s)`);
