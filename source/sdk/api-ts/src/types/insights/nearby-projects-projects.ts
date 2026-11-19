import type { InsightsNearbyProjectsProjectsMedia } from "#sdk/types/insights/nearby-projects-projects-media.ts";

/** Nearby Projects Projects */
export interface InsightsNearbyProjectsProjects {
  amount?: number | null;
  code: string;
  contractor?: string | null;
  distanceKm: number;
  location: unknown;
  media: InsightsNearbyProjectsProjectsMedia;
  name: string;
  responsible?: string | null;
  status: string;
  unit: string;
  unitId: string;
  unitPath: string;
}
