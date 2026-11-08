
import type { ChangeKind } from "#/types/geography/change-kind.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { GeoUnit } from "#/types/geography/geo-unit.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Geo Unit Change Public */
export interface GeoUnitChangePublic {
  createdAt: DateTime;
  id: Id;
  isCurrent: Flag;
  kind: ChangeKind;
  sourceUnitId: Id;
  targetUnitId: Id;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}