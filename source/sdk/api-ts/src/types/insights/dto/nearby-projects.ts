import type { InsightsNearbyProjectsProjects } from "#sdk/types/insights/dto/nearby-projects-projects.ts";

/** Nearby Projects */
export interface InsightsNearbyProjects {
  gaps: string[];
  projects: InsightsNearbyProjectsProjects[];
  radiusKm: number;
}
