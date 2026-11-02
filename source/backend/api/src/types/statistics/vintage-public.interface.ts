
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { ReleaseLabel } from "#/types/statistics/release-label.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Vintage Public */
export interface VintagePublic {
  code: BusinessCode;
  createdAt: DateTime;
  id: Id;
  isCurrent: Flag;
  label: ReleaseLabel;
  publisherInstitutionId?: Id | null;
  releasedOn?: Date | null;
  supersedesId?: Id | null;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}