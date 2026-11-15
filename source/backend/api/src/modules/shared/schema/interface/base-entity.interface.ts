import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { DateTime } from "#/modules/shared/schema/type/date-time.type.ts";

/** Base Entity */
export interface BaseEntity {
  createdAt: DateTime;
  id: Id;
  updatedAt: DateTime;
  version: NonNegativeInteger;
}
