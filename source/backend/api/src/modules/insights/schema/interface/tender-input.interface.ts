import type { Limit } from "#/modules/insights/schema/type/limit.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";

/** Tender Input */
export interface TenderInput {
  featureId?: Id;
  limit?: Limit;
  status?: NonEmptyString100;
}
