import { StatisticsAggregation } from "#sdk/types/statistics/enums/aggregation.ts";
import { StatisticsFrequency } from "#sdk/types/statistics/enums/frequency.ts";
import type { StatisticsIndicatorEntryNames } from "#sdk/types/statistics/dto/indicator-entry-names.ts";

/** Indicator Entry */
export interface StatisticsIndicatorEntry {
  aggregation: StatisticsAggregation;
  code: string;
  decimals: number | null;
  frequency: StatisticsFrequency | null;
  higherIsBetter: boolean | null;
  indicatorId: string;
  kindTerm: string;
  names: StatisticsIndicatorEntryNames[];
  roleTerm: string | null;
  topicTerm: string;
  unitSymbol: string | null;
}
