
import type { Id } from "#/modules/shared/id.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/non-negative-integer.type.ts";
import type { DateTime } from "#/modules/shared/date-time.type.ts";

/** Base Entity */
export interface BaseEntity {
  createdAt: DateTime;
  id: Id;
  updatedAt: DateTime;
  version: NonNegativeInteger;
}