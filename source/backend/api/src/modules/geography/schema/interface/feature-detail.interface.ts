import type { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { FeatureDetailNames } from "#/modules/geography/schema/interface/feature-detail-names.interface.ts";

/** Feature Detail */
export interface FeatureDetail {
  code: IdentityCode;
  featureId: Id;
  featureTypeId: Id;
  fromToPrecision: DatePrecision | null;
  fromYear: Year | null;
  names: FeatureDetailNames[];
  toYear: Year | null;
}
