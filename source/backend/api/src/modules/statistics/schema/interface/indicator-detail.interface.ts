import type { Aggregation } from "#/modules/statistics/schema/enum/aggregation.enum.ts";
import type { Frequency } from "#/modules/statistics/schema/enum/frequency.enum.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { Decimals } from "#/modules/statistics/schema/type/decimals.type.ts";
import type { IndicatorDetailDimensions } from "#/modules/statistics/schema/interface/indicator-detail-dimensions.interface.ts";
import type { IndicatorDetailNames } from "#/modules/statistics/schema/interface/indicator-detail-names.interface.ts";

/** Indicator Detail */
export interface IndicatorDetail {
  aggregation: Aggregation;
  code: IdentityCode;
  decimals: Decimals | null;
  dimensions: IndicatorDetailDimensions[];
  frequency: Frequency | null;
  higherIsBetter: Flag | null;
  indicatorId: Id;
  isDerived: Flag;
  kindTerm: Id;
  names: IndicatorDetailNames[];
  topicTerm: Id;
  unitId: Id | null;
  unitSymbol: NonEmptyString100 | null;
}
