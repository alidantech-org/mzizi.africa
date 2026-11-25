import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { OfficeDetailHoldersNames } from "#/modules/governance/schema/interface/office-detail-holders-names.interface.ts";
import type { OfficeDetailHoldersSteps } from "#/modules/governance/schema/interface/office-detail-holders-steps.interface.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Office Detail Holders */
export interface OfficeDetailHolders {
  endsOn: CalendarDate | null;
  fromYear: Year | null;
  holderId: Id;
  individualCode: IdentityCode;
  individualId: Id;
  methodTerm: Id;
  names: OfficeDetailHoldersNames[];
  startsOn: CalendarDate | null;
  steps: OfficeDetailHoldersSteps[];
  toYear: Year | null;
}
