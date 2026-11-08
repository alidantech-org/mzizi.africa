import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { DataSource } from "typeorm";

/**
 * Loads fixture-format rows: test fixtures from source/backend/engine/database/fixtures/neutral-model (readFixture) and system seeds from the root `seed/` (readSeed). Rows are written in
 * dependency order; a string value "@key" refers to the id of the row with that key.
 *
 * Data rows carry no provenance, so the loader records it where it belongs: one source document
 * ("Test fixture"), one capture-less attribution per domain row with a `curated` method, and an
 * `unverified` current verification. Fixture rows therefore can never pass for canonical data.
 */
export interface FixtureRow {
  entity: string;
  key: string;
  values: Record<string, unknown>;
}

export const fixturesRoot = join(import.meta.dirname, "../../../engine/database/fixtures");
export const fixturesDir = join(fixturesRoot, "neutral-model");

/** Root of the system seed inputs (repository-root `seed/`); override with MZIZI_SEED_ROOT. */
export const seedRoot = process.env.MZIZI_SEED_ROOT ?? join(import.meta.dirname, "../../../../../seed");

/** Reads a JSON seed input by its path under `seed/`, e.g. "global/reference/media-formats.json". */
export function readSeed<T = { country: string; rows: FixtureRow[] }>(path: string): T {
  return JSON.parse(readFileSync(join(seedRoot, path), "utf8")) as T;
}

/** Fixed placeholder for the vocabulary ids a fixture document needs but does not model. */
const PLACEHOLDER_KIND = "00000000-0000-4000-8000-000000000001";

/** Test-only fixtures (neutral-model); system seeds are read with readSeed. */
export function readFixture(name: string): { country: string; rows: FixtureRow[] } {
  return JSON.parse(readFileSync(join(fixturesDir, `${name}.json`), "utf8"));
}

interface Provenance {
  documentId: string;
  methodId: string;
}

async function save(db: DataSource, entity: string, values: Record<string, unknown>): Promise<string> {
  const metadata = db.entityMetadatas.find((candidate) => candidate.name === entity);
  if (!metadata) throw new Error(`unknown entity ${entity}`);
  const repository = db.getRepository(metadata.target as never);
  const now = new Date();
  const columns = new Set(metadata.columns.map((column) => column.propertyName));
  const stamp: Record<string, unknown> = { createdAt: now, updatedAt: now, version: 1 };
  if (columns.has("isCurrent")) stamp.isCurrent = true;
  const saved = await repository.save(repository.create({ ...stamp, ...values } as never));
  return (saved as unknown as { id: string }).id;
}

/** The seeded classification for a source kind when the reference seed was loaded, else the placeholder id (API-only test databases). */
async function kindId(db: DataSource, scheme: string, code: string): Promise<string> {
  try {
    const rows = await db.query(`SELECT id FROM reference.classifications WHERE scheme = $1 AND code = $2 LIMIT 1`, [scheme, `${scheme}/${code}`]);
    return rows[0]?.id ?? PLACEHOLDER_KIND;
  } catch {
    return PLACEHOLDER_KIND;
  }
}

async function fixtureProvenance(db: DataSource, ids: Map<string, string>): Promise<Provenance> {
  if (!ids.has("fixture:document")) {
    const publisher = await save(db, "PublisherEntity", { kindId: await kindId(db, "source/publisher-kind", "institution"), code: "test-fixtures", name: "Test fixtures" });
    ids.set("fixture:document", await save(db, "DocumentEntity", { publisherId: publisher, kindId: await kindId(db, "source/document-kind", "dataset"), title: "Test fixture", licence: "none" }));
    ids.set("fixture:method", await save(db, "MethodEntity", { kind: "curated", name: "Fixture loader", tool: "fixture-loader" }));
  }
  return { documentId: ids.get("fixture:document") as string, methodId: ids.get("fixture:method") as string };
}

/** options.provenance false loads rows without the test-fixture attribution and verification (for registry rows that are not claims about the world). */
export async function loadFixtures(db: DataSource, rows: FixtureRow[], ids: Map<string, string> = new Map(), options: { provenance?: boolean } = {}): Promise<Map<string, string>> {
  const withProvenance = options.provenance !== false;
  const provenance = withProvenance ? await fixtureProvenance(db, ids) : ({ documentId: "", methodId: "" } as Provenance);
  for (const row of rows) {
    // A key that is already loaded (for example by the reference seed) is not loaded twice.
    if (ids.has(row.key)) continue;
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
    const id = await save(db, row.entity, values);
    ids.set(row.key, id);

    // Domain facts (valid time) get their provenance in the source schema.
    if (withProvenance && metadata.columns.some((column) => column.propertyName === "validFrom")) {
      const targetKind = `${metadata.schema}.${metadata.tableName}`;
      await save(db, "AttributionEntity", { documentId: provenance.documentId, methodId: provenance.methodId, targetKind, targetId: id, relation: "supports" });
      await save(db, "VerificationEntity", { targetKind, targetId: id, state: "unverified", isCurrent: true });
    }
  }
  return ids;
}
