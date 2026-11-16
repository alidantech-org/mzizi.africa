import type { FeatureEntry } from "#/modules/geography/schema/interface/feature-entry.interface.ts";

/** Feature Collection */
export interface FeatureCollection {
  features: FeatureEntry[];
}
