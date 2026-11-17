import type { LocalityLocalityUnit } from "#sdk/types/locality/locality-unit.ts";
import type { LocalityMediaRef } from "#sdk/types/locality/media-ref.ts";
import type { LocalityOfficeHolder } from "#sdk/types/locality/office-holder.ts";
import type { LocalityProcurementSummary } from "#sdk/types/locality/procurement-summary.ts";

/** Locality Profile */
export interface LocalityLocalityProfile {
  chain: LocalityLocalityUnit[];
  gaps: string[];
  languageRequested?: string | null;
  languageServed: string;
  media: LocalityMediaRef[];
  officials: LocalityOfficeHolder[];
  place: LocalityLocalityUnit;
  procurement: LocalityProcurementSummary;
}
