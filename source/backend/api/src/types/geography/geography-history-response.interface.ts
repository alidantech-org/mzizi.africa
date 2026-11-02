
import type { GeoUnitChangePublic } from "#/types/geography/geo-unit-change-public.interface.ts";
import type { GeoUnitNameVersionPublic } from "#/types/geography/geo-unit-name-version-public.interface.ts";

/** Geography History Response */
export interface GeographyHistoryResponse {
  changes: GeoUnitChangePublic[];
  names: GeoUnitNameVersionPublic[];
}