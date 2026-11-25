import type { StatisticsIndicatorEntry } from "#sdk/types/statistics/dto/indicator-entry.ts";

/** Indicator Collection */
export interface StatisticsIndicatorCollection {
  indicators: StatisticsIndicatorEntry[];
}
