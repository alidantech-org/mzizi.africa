
import type { ExpectationBasis } from "#/types/place/expectation-basis.enum.ts";
import type { ExpectationStatus } from "#/types/place/expectation-status.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Count } from "#/types/shared/count.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { TargetKind } from "#/types/shared/target-kind.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { HistoricalEntity } from "#/types/shared/historical-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Expectation */
export interface Expectation {
  basis: ExpectationBasis;
  createdAt: DateTime;
  facilityTypeId?: Id | null;
  id: Id;
  isCurrent: Flag;
  maxCount?: Count | null;
  minCount: Count;
  resolvedOccupancyId?: Id | null;
  roleId: Id;
  scopeGeoUnitId?: Id | null;
  status: ExpectationStatus;
  subjectId: Id;
  subjectKind: TargetKind;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}