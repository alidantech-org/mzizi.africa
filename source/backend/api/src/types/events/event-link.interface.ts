
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { LinkRole } from "#/types/events/link-role.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { TargetKind } from "#/types/shared/target-kind.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Event } from "#/types/events/event.interface.ts";
import type { HistoricalEntity } from "#/types/shared/historical-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Event Link */
export interface EventLink {
  createdAt: DateTime;
  eventId: Id;
  id: Id;
  isCurrent: Flag;
  role?: LinkRole | null;
  targetId: Id;
  targetKind: TargetKind;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}