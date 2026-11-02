import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { DataSource } from "typeorm";

/**
 * Loads db-engine fixtures (source/backend/db-engine/fixtures) for tests. Rows are written in
 * dependency order; a string value "@key" refers to the id of the row with that key. Evidence
 * fields are filled so a fixture row can never pass for canonical data: source "Test fixture",
 * method curated, state unverified.
 */
export interface FixtureRow {
  entity: string;
  key: string;
  values: Record<string, unknown>;
}

export const fixturesDir = join(import.meta.dirname, "../../../db-engine/fixtures/neutral-model");

export function readFixture(name: string): { country: string; rows: FixtureRow[] } {
  return JSON.parse(readFileSync(join(fixturesDir, `${name}.json`), "utf8"));
}

export async function loadFixtures(db: DataSource, rows: FixtureRow[], ids: Map<string, string> = new Map()): Promise<Map<string, string>> {
  for (const row of rows) {
    const metadata = db.entityMetadatas.find((candidate) => candidate.name === row.entity);
    if (!metadata) throw new Error(`fixture row ${row.key}: unknown entity ${row.entity}`);
    const values: Record<string, unknown> = {};
    for (const [field, value] of Object.entries(row.values)) {
      if (typeof value === "string" && value.startsWith("@")) {
        const id = ids.get(value.slice(1));
        if (!id) throw new Error(`fixture row ${row.key}: ${field} refers to unknown key ${value}`);
        values[field] = id;
      } else {
        values[field] = value;
      }
    }
    const isEvidenced = metadata.columns.some((column) => column.propertyName === "sourceName");
    const stamp = { createdAt: new Date(), updatedAt: new Date(), version: 1 };
    const evidence = isEvidenced ? { sourceName: "Test fixture", method: "curated", verificationState: "unverified", isCurrent: true } : {};
    const repository = db.getRepository(metadata.target as never);
    const saved = await repository.save(repository.create({ ...stamp, ...evidence, ...values } as never));
    ids.set(row.key, (saved as unknown as { id: string }).id);
  }
  return ids;
}
