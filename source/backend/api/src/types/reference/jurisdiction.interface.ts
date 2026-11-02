
import type { JurisdictionKind } from "#/types/reference/jurisdiction-kind.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { JurisdictionCode } from "#/types/shared/jurisdiction-code.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { HistoricalEntity } from "#/types/shared/historical-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Jurisdiction */
export interface Jurisdiction {
  code: JurisdictionCode;
  createdAt: DateTime;
  id: Id;
  isCurrent: Flag;
  kind: JurisdictionKind;
  name: Name;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}