import type { LanguageCode } from "#/modules/locality/schema/type/language-code.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { LocalityUnit } from "#/modules/locality/schema/interface/locality-unit.interface.ts";
import type { MediaRef } from "#/modules/locality/schema/interface/media-ref.interface.ts";
import type { OfficeHolder } from "#/modules/locality/schema/interface/office-holder.interface.ts";
import type { ProcurementSummary } from "#/modules/locality/schema/interface/procurement-summary.interface.ts";

/** Locality Profile */
export interface LocalityProfile {
  chain: LocalityUnit[];
  gaps: NonEmptyString500[];
  languageRequested?: LanguageCode | null;
  languageServed: LanguageCode;
  media: MediaRef[];
  officials: OfficeHolder[];
  place: LocalityUnit;
  procurement: ProcurementSummary;
}
