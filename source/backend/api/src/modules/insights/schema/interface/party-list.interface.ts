import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/** Party List */
export interface PartyList {
  gaps: NonEmptyString500[];
  parties: Record<string, unknown>[];
}
