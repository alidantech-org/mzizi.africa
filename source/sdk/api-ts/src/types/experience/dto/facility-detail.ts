import type { ExperienceFacilityRow } from "#sdk/types/experience/dto/facility-row.ts";
import type { ExperienceHostedStation } from "#sdk/types/experience/dto/hosted-station.ts";
import type { ExperiencePlaceRef } from "#sdk/types/experience/dto/place-ref.ts";

/** Facility Detail */
export interface ExperienceFacilityDetail {
  chain: ExperiencePlaceRef[];
  facility: ExperienceFacilityRow;
  gaps: string[];
  stations: ExperienceHostedStation[];
}
