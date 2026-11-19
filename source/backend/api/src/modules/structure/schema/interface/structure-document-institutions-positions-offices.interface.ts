import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Structure Document Institutions Positions Offices */
export interface StructureDocumentInstitutionsPositionsOffices {
  abolishedOn: CalendarDate | null;
  code: IdentityCode;
  featureId: Id | null;
  id: Id;
  ordinal: PositiveInteger | null;
}
