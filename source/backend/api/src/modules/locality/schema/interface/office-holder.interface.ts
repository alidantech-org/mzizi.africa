import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { EvidenceRef } from "#/modules/locality/schema/interface/evidence-ref.interface.ts";
import type { MediaRef } from "#/modules/locality/schema/interface/media-ref.interface.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Office Holder */
export interface OfficeHolder {
  evidence: EvidenceRef[];
  holderId: Id;
  leftOfficeOn?: CalendarDate | null;
  officeCode: IdentityCode;
  officeTitle: Name;
  partyName?: Name | null;
  personName: Name;
  portrait?: MediaRef | null;
  tookOfficeOn?: CalendarDate | null;
  unitFeatureId?: Id | null;
  unitName?: Name | null;
}
