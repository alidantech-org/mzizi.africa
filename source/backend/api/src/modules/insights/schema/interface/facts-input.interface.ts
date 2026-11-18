import type { Limit } from "#/modules/insights/schema/type/limit.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";

/** Facts Input */
export interface FactsInput {
  featureId?: Id;
  limit?: Limit;
}
