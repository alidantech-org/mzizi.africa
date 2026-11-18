import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/** Tender List */
export interface TenderList {
  gaps: NonEmptyString500[];
  summary: Record<string, unknown>;
  tenders: Record<string, unknown>[];
}
