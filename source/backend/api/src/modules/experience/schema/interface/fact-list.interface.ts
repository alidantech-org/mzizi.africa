import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { FactRow } from "#/modules/experience/schema/interface/fact-row.interface.ts";

/** Fact List */
export interface FactList {
  facts: FactRow[];
  gaps: NonEmptyString500[];
}
