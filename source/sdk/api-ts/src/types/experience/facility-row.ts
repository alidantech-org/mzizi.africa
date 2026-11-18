import type { ExperienceCapacity } from "#sdk/types/experience/capacity.ts";

/** Facility Row */
export interface ExperienceFacilityRow {
  capacity: ExperienceCapacity[];
  classCode: string;
  classLabel: string;
  code: string;
  domainCode: string;
  domainLabel: string;
  featureId: string;
  latitude?: number | null;
  longitude?: number | null;
  name: string;
  operator?: string | null;
  ownershipLabel?: string | null;
  placeName?: string | null;
  placePath?: string | null;
  statusLabel: string;
}
