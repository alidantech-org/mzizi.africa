import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/** Maker Commitments */
export interface MakerCommitments {
  limit?: Integer;
  makerId: Id;
  offset?: Integer;
}
