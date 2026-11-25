import { StatisticsAggregation } from "#sdk/types/statistics/enums/aggregation.ts";
import { StatisticsFrequency } from "#sdk/types/statistics/enums/frequency.ts";
import type { StatisticsIndicatorDetailDimensions } from "#sdk/types/statistics/dto/indicator-detail-dimensions.ts";
import type { StatisticsIndicatorDetailNames } from "#sdk/types/statistics/dto/indicator-detail-names.ts";

/** Indicator Detail */
export interface StatisticsIndicatorDetail {
  aggregation: StatisticsAggregation;
  code: string;
  decimals: number | null;
  dimensions: StatisticsIndicatorDetailDimensions[];
  frequency: StatisticsFrequency | null;
  higherIsBetter: boolean | null;
  indicatorId: string;
  isDerived: boolean;
  kindTerm: string;
  names: StatisticsIndicatorDetailNames[];
  topicTerm: string;
  unitId: string | null;
  unitSymbol: string | null;
}
