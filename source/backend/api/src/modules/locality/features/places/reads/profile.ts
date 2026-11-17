/** Assembles the place document: the chain, the officials and procurement of its units, media and what is missing. */
import type { DataSource } from "typeorm";

import type { LocalityProfile } from "#/modules/locality/schema/interface/locality-profile.interface.ts";
import { servedLanguage } from "#/modules/locality/features/places/reads/language.ts";
import { officialsFor } from "#/modules/locality/features/places/reads/officials.ts";
import { chainOf } from "#/modules/locality/features/places/reads/places.ts";
import { procurementFor } from "#/modules/locality/features/places/reads/procurement.ts";

/** The place document for a feature, or null when the feature does not exist. */
export async function buildProfile(
  db: DataSource,
  featureId: string,
  requested: string | undefined,
  onDate: string | undefined,
): Promise<LocalityProfile | null> {
  const lang = await servedLanguage(db, requested);
  const chain = await chainOf(db, featureId, lang);
  const place = chain[chain.length - 1];
  if (place === undefined) return null;
  // Narrowest unit first, so the closest office holders and projects lead the lists.
  const unitIds = [...chain].reverse().map((unit) => unit.featureId);
  const [officials, procurement] = await Promise.all([
    officialsFor(db, unitIds, lang, onDate),
    procurementFor(db, unitIds),
  ]);
  const gaps: string[] = [];
  if (officials.length === 0) gaps.push("No office holders are recorded for this place yet.");
  if (procurement.count === 0) gaps.push("No procurement is recorded for this place yet.");
  gaps.push("No media is recorded for this place yet.");
  return {
    place,
    chain,
    officials,
    procurement,
    media: [],
    languageRequested: requested ?? null,
    languageServed: lang,
    gaps,
  };
}
