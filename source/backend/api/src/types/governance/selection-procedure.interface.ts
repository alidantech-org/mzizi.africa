
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Office } from "#/types/governance/office.interface.ts";
import type { HistoricalEntity } from "#/types/shared/historical-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Selection Procedure */
export interface SelectionProcedure {
  createdAt: DateTime;
  description?: Description | null;
  id: Id;
  isCurrent: Flag;
  legalBasisId?: Id | null;
  methodId: Id;
  officeId: Id;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}