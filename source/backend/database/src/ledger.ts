/** The technical tables in `public`: database identity (`mzizi_target`) and the migration ledger (`mzizi_migrations`). */
import type { SQL } from "bun";
import { TARGET_NAME } from "./config.ts";
import type { Release } from "./releases.ts";

export interface AppliedRelease {
  readonly name: string;
  readonly checksum: string;
}

/** Creates the identity and ledger tables if missing and checks the database identifies as the expected target. */
export async function ensure(sql: SQL): Promise<void> {
  await sql.begin(async (tx) => {
    await tx`CREATE TABLE IF NOT EXISTS public.mzizi_target (
      name text PRIMARY KEY,
      created_at timestamptz NOT NULL DEFAULT now()
    )`;
    await tx`CREATE TABLE IF NOT EXISTS public.mzizi_migrations (
      name text PRIMARY KEY,
      checksum text NOT NULL,
      applied_at timestamptz NOT NULL DEFAULT now()
    )`;
    await tx`INSERT INTO public.mzizi_target (name) VALUES (${TARGET_NAME}) ON CONFLICT DO NOTHING`;
  });
  const rows = await sql<{ name: string }[]>`SELECT name FROM public.mzizi_target LIMIT 1`;
  const identity = rows[0]?.name;
  if (identity !== TARGET_NAME) {
    throw new Error(`target identity mismatch: database says ${JSON.stringify(identity)}, expected ${JSON.stringify(TARGET_NAME)}`);
  }
}

export async function applied(sql: SQL): Promise<AppliedRelease[]> {
  return await sql<AppliedRelease[]>`SELECT name, checksum FROM public.mzizi_migrations ORDER BY name`;
}

/** Applies one release and its ledger row in a single transaction. */
export async function applyRelease(sql: SQL, release: Release): Promise<void> {
  await sql.begin(async (tx) => {
    await tx.unsafe(release.sql);
    await tx`INSERT INTO public.mzizi_migrations (name, checksum) VALUES (${release.name}, ${release.checksum})`;
  });
}

/** Compares releases on disk with the ledger. Throws on a changed or missing applied release. */
export function reconcile(
  releases: readonly Release[],
  ledger: readonly AppliedRelease[],
): { pending: Release[]; settled: Release[] } {
  for (const row of ledger) {
    const release = releases.find((candidate) => candidate.name === row.name);
    if (!release) throw new Error(`applied release ${row.name} is missing on disk`);
    if (release.checksum !== row.checksum) throw new Error(`release ${row.name} changed after it was applied; refusing`);
  }
  const names = new Set(ledger.map((row) => row.name));
  return {
    pending: releases.filter((release) => !names.has(release.name)),
    settled: releases.filter((release) => names.has(release.name)),
  };
}
