import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/** Engagement */
export interface Engagement {
  liked: Flag;
  likes: NonNegativeInteger;
}
