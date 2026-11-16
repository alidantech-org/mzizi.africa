import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { FeatureEntryNames } from "#/modules/geography/schema/interface/feature-entry-names.interface.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Feature Entry */
export interface FeatureEntry {
  code: IdentityCode;
  featureId: Id;
  featureTypeId: Id;
  names: FeatureEntryNames[];
  validFrom: CalendarDate | null;
  validUntil: CalendarDate | null;
}
