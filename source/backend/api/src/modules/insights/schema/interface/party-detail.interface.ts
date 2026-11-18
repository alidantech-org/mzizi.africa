import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/** Party Detail */
export interface PartyDetail {
  funding: Record<string, unknown>[];
  gaps: NonEmptyString500[];
  members: Record<string, unknown>[];
  party: Record<string, unknown>;
  results: Record<string, unknown>[];
}
