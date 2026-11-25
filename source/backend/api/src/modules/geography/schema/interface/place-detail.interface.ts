import type { IdentityKind } from "#/modules/shared/schema/enum/identity-kind.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { PlaceDetailNames } from "#/modules/geography/schema/interface/place-detail-names.interface.ts";
import type { PlaceDetailParents } from "#/modules/geography/schema/interface/place-detail-parents.interface.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Place Detail */
export interface PlaceDetail {
  code: IdentityCode;
  endedOn: CalendarDate | null;
  establishedOn: CalendarDate | null;
  featureId: Id;
  fromYear: Year | null;
  identityKind: IdentityKind;
  kindTerm: Id;
  names: PlaceDetailNames[];
  parents: PlaceDetailParents[];
  toYear: Year | null;
}
