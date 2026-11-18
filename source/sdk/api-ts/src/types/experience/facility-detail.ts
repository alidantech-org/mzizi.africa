import type { ExperienceFacilityRow } from "#sdk/types/experience/facility-row.ts";
import type { ExperienceHostedStation } from "#sdk/types/experience/hosted-station.ts";
import type { ExperiencePlaceRef } from "#sdk/types/experience/place-ref.ts";

/** Facility Detail */
export interface ExperienceFacilityDetail {
  chain: ExperiencePlaceRef[];
  facility: ExperienceFacilityRow;
  gaps: string[];
  stations: ExperienceHostedStation[];
}
