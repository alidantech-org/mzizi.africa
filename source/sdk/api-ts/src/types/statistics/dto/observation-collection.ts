import type { StatisticsObservationEntry } from "#sdk/types/statistics/dto/observation-entry.ts";

/** Observation Collection */
export interface StatisticsObservationCollection {
  observations: StatisticsObservationEntry[];
}
