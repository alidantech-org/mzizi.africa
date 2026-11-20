import type { LocalityLocalityUnit } from "#sdk/types/locality/dto/locality-unit.ts";
import type { LocalityMediaRef } from "#sdk/types/locality/dto/media-ref.ts";
import type { LocalityOfficeHolder } from "#sdk/types/locality/dto/office-holder.ts";
import type { LocalityProcurementSummary } from "#sdk/types/locality/dto/procurement-summary.ts";

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
