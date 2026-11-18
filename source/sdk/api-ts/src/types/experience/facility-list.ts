import type { ExperienceClassCount } from "#sdk/types/experience/class-count.ts";
import type { ExperienceFacilityRow } from "#sdk/types/experience/facility-row.ts";

/** Facility List */
export interface ExperienceFacilityList {
  classes: ExperienceClassCount[];
  facilities: ExperienceFacilityRow[];
  gaps: string[];
  total: number;
}
