
import type { Description } from "#/modules/shared/description.type.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** An edge in a geographic transformation; multiple rows sharing transformation_id represent splits, mergers, creation or dissolution without overwriting predecessor identities. */
export interface Changes {
  changeKindId: Id;
  createdAt: Instant;
  deletedAt?: Instant | null;
  effectiveOn?: CalendarDate | null;
  explanation?: Description | null;
  id: Id;
  predecessorFeatureId?: Id | null;
  sourceRefId?: Id | null;
  successorFeatureId?: Id | null;
  transformationId: Id;
  updatedAt: Instant;
  version: PositiveInteger;
}