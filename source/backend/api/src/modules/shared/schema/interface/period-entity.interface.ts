import type { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/** Base for versioned records with a period of integer years and one precision for the pair. */
export interface PeriodEntity {
  createdAt: Instant;
  deletedAt?: Instant | null;
  fromToPrecision?: DatePrecision | null;
  fromYear?: Year | null;
  id: Id;
  toYear?: Year | null;
  updatedAt: Instant;
  version: PositiveInteger;
}
