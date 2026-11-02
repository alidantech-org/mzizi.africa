
import type { DepartureReason } from "#/types/governance/departure-reason.enum.ts";
import type { HolderStatus } from "#/types/governance/holder-status.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Count } from "#/types/shared/count.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Office } from "#/types/governance/office.interface.ts";
import type { HistoricalEntity } from "#/types/shared/historical-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Office Holder */
export interface OfficeHolder {
  createdAt: DateTime;
  departureReason?: DepartureReason | null;
  id: Id;
  isCurrent: Flag;
  legalBasisId?: Id | null;
  officeId: Id;
  personId: Id;
  selectionProcedureId?: Id | null;
  status: HolderStatus;
  termNumber?: Count | null;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}