
import type { PlaceKind } from "#/types/place/place-kind.enum.ts";
import type { PlaceStatus } from "#/types/place/place-status.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Latitude } from "#/types/place/latitude.type.ts";
import type { Longitude } from "#/types/place/longitude.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { HistoricalEntity } from "#/types/shared/historical-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Place */
export interface Place {
  addressText?: LongText | null;
  availableFrom?: Date | null;
  buildingTypeId?: Id | null;
  createdAt: DateTime;
  id: Id;
  isCurrent: Flag;
  kind: PlaceKind;
  latitude?: Latitude | null;
  locatedInUnitId?: Id | null;
  longitude?: Longitude | null;
  name: Name;
  parentId?: Id | null;
  status: PlaceStatus;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}