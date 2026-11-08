import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { DataSource } from "typeorm";

import { seedRoot } from "./config.ts";

/**
 * Flag and emblem expectation per geography level (TSK-A6C9B9251A15). Sets `flag_expected` and `emblem_expected`
 * (has, none, unknown) on the classification record of each level of a jurisdiction. Only fills a level whose
 * expectation is still unset or `unknown`: a reviewed value is never replaced. These are annotation columns, not
 * history, so the row is updated in place (its id is referenced by every unit of the level).
 */
export async function seedMediaExpectations(db: DataSource, jurisdictionCode = "ke"): Promise<{ levels: number }> {
  const file = JSON.parse(readFileSync(join(seedRoot, "ke", "registry", "ke-media-expectations.json"), "utf8")) as { levels: { code: string; flag: string; emblem: string }[] };
  let levels = 0;
  for (const level of file.levels) {
    const updated = await db.query(
      `UPDATE reference.classifications c SET flag_expected = COALESCE(NULLIF(c.flag_expected::text, 'unknown'), $2)::reference.classifications_flag_expected_enum,
              emblem_expected = COALESCE(NULLIF(c.emblem_expected::text, 'unknown'), $3)::reference.classifications_emblem_expected_enum, updated_at = now()
        WHERE c.code = $1 AND c.jurisdiction_id = (SELECT id FROM reference.jurisdictions WHERE code = $4) RETURNING c.id`,
      [level.code, level.flag, level.emblem, jurisdictionCode],
    );
    levels += updated.length;
  }
  return { levels };
}
