import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { NearbyProjectsProjects } from "#/modules/insights/schema/interface/nearby-projects-projects.interface.ts";

/** Nearby Projects */
export interface NearbyProjects {
  gaps: NonEmptyString500[];
  projects: NearbyProjectsProjects[];
  radiusKm: Number;
}
