import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";
import type { NearbyProjectsProjectsMedia } from "#/modules/insights/schema/interface/nearby-projects-projects-media.interface.ts";

/** Nearby Projects Projects */
export interface NearbyProjectsProjects {
  amount?: Number | null;
  code: String;
  contractor?: String | null;
  distanceKm: Number;
  location: unknown;
  media: NearbyProjectsProjectsMedia;
  name: String;
  responsible?: String | null;
  status: String;
  unit: String;
  unitId: String;
  unitPath: String;
}
