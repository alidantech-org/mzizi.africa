import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { FeatureDetailNames } from "#/modules/geography/schema/interface/feature-detail-names.interface.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Feature Detail */
export interface FeatureDetail {
  code: IdentityCode;
  featureId: Id;
  featureTypeId: Id;
  names: FeatureDetailNames[];
  validFrom: CalendarDate | null;
  validUntil: CalendarDate | null;
}
