
import type { Exposure } from "#/types/person/exposure.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { HandleName } from "#/types/person/handle-name.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Person } from "#/types/person/person.interface.ts";
import type { HistoricalEntity } from "#/types/shared/historical-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Person Handle */
export interface PersonHandle {
  createdAt: DateTime;
  exposure: Exposure;
  handle: HandleName;
  id: Id;
  isCurrent: Flag;
  isVerified: Flag;
  personId: Id;
  platformId: Id;
  updatedAt: DateTime;
  url?: Url | null;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}