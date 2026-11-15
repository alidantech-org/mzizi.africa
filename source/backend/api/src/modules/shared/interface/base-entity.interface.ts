
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/type/non-negative-integer.type.ts";
import type { DateTime } from "#/modules/shared/type/date-time.type.ts";

/** Base Entity */
export interface BaseEntity {
  createdAt: DateTime;
  id: Id;
  updatedAt: DateTime;
  version: NonNegativeInteger;
}