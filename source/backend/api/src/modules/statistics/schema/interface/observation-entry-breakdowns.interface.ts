import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/** Observation Entry Breakdowns */
export interface ObservationEntryBreakdowns {
  schemeId: Id;
  termCode: IdentityCode;
  termId: Id;
}
