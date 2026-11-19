import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";
import type { PlaceCivicProjectsMedia } from "#/modules/insights/schema/interface/place-civic-projects-media.interface.ts";

/** Place Civic Projects */
export interface PlaceCivicProjects {
  amount?: Number | null;
  code: String;
  completedOn?: String | null;
  contractor?: String | null;
  location?: unknown | null;
  media: PlaceCivicProjectsMedia;
  name: String;
  startedOn: String;
  status: String;
  unit: String;
  unitId: String;
  unitPath: String;
}
