
import type { ValueRelationKind } from "#/modules/reference/value-relation-kind.enum.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { CalendarDate } from "#/modules/shared/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Proposed directed, typed, time-aware relation between classification values; supports multi-parent and cross-scheme taxonomy. */
export interface ValueRelation {
  createdAt: Instant;
  deletedAt?: Instant | null;
  id: Id;
  relationKind: ValueRelationKind;
  sourceValueId: Id;
  targetValueId: Id;
  validFrom?: CalendarDate | null;
  validUntil?: CalendarDate | null;
}