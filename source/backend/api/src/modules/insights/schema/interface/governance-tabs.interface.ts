import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/** Governance Tabs */
export interface GovernanceTabs {
  arms: Record<string, unknown>[];
  gaps: NonEmptyString500[];
  tabs: Record<string, unknown>[];
}
