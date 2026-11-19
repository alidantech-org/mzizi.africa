import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { PlaceStatisticsSiblingsDensity } from "#/modules/insights/schema/interface/place-statistics-siblings-density.interface.ts";
import type { PlaceStatisticsSiblingsPopulation } from "#/modules/insights/schema/interface/place-statistics-siblings-population.interface.ts";

/** Place Statistics Siblings */
export interface PlaceStatisticsSiblings {
  density?: PlaceStatisticsSiblingsDensity | null;
  peers: Number;
  population?: PlaceStatisticsSiblingsPopulation | null;
}
