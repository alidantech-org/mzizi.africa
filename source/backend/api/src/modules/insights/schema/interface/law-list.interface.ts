import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { LawInstrument } from "#/modules/insights/schema/interface/law-instrument.interface.ts";

/** Law List */
export interface LawList {
  gaps: NonEmptyString500[];
  instruments: LawInstrument[];
}
