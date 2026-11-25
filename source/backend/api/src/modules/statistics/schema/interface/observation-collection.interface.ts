import type { ObservationEntry } from "#/modules/statistics/schema/interface/observation-entry.interface.ts";

/** Observation Collection */
export interface ObservationCollection {
  observations: ObservationEntry[];
}
