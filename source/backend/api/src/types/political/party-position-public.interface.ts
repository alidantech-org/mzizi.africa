
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { PartyUnit } from "#/types/political/party-unit.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Party Position Public */
export interface PartyPositionPublic {
  code: BusinessCode;
  createdAt: DateTime;
  id: Id;
  isCurrent: Flag;
  title: Name;
  unitId: Id;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}