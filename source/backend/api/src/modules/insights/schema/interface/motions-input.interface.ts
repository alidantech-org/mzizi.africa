import type { Limit } from "#/modules/insights/schema/type/limit.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";

/** Motions Input */
export interface MotionsInput {
  institutionId?: Id;
  limit?: Limit;
}
