
import type { GeographyEntity } from "#/types/geography/geography-entity.interface.ts";

/** Geography Hierarchy Response */
export interface GeographyHierarchyResponse {
  ancestors: GeographyEntity[];
  children: GeographyEntity[];
  entity: GeographyEntity;
}