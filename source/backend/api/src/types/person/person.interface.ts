
import type { LifeStatus } from "#/types/person/life-status.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { HistoricalEntity } from "#/types/shared/historical-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Person */
export interface Person {
  birthDate?: Date | null;
  birthDatePrecision?: DatePrecision | null;
  birthPlaceId?: Id | null;
  code: BusinessCode;
  createdAt: DateTime;
  deathDate?: Date | null;
  deathDatePrecision?: DatePrecision | null;
  displayName: Name;
  familyName?: Name | null;
  givenName?: Name | null;
  id: Id;
  isCurrent: Flag;
  lifeStatus: LifeStatus;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}