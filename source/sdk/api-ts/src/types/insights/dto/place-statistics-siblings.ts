import type { InsightsPlaceStatisticsSiblingsDensity } from "#sdk/types/insights/dto/place-statistics-siblings-density.ts";
import type { InsightsPlaceStatisticsSiblingsPopulation } from "#sdk/types/insights/dto/place-statistics-siblings-population.ts";

/** Place Statistics Siblings */
export interface InsightsPlaceStatisticsSiblings {
  density?: InsightsPlaceStatisticsSiblingsDensity | null;
  peers: number;
  population?: InsightsPlaceStatisticsSiblingsPopulation | null;
}
