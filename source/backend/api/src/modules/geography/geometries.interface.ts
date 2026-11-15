
import type { Id } from "#/modules/shared/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** A dated spatial representation version for a feature. The geometry field remains an unsupported Dryv placeholder and is excluded from generation. */
export interface Geometries {
  createdAt: Instant;
  deletedAt?: Instant | null;
  featureId: Id;
  fileVersionRefId?: Id | null;
  geometry: unknown;
  geometryRoleId: Id;
  id: Id;
  observedAt?: Instant | null;
  sourceRefId?: Id | null;
  srid: PositiveInteger;
  updatedAt: Instant;
  validFrom?: CalendarDate | null;
  validUntil?: CalendarDate | null;
  version: PositiveInteger;
}