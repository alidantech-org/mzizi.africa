import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/** Motion Votes */
export interface MotionVotes {
  countryId: Id;
  limit?: Integer;
  motionId: Id;
  offset?: Integer;
}
