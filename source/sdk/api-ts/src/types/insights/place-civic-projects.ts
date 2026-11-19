import type { InsightsPlaceCivicProjectsMedia } from "#sdk/types/insights/place-civic-projects-media.ts";

/** Place Civic Projects */
export interface InsightsPlaceCivicProjects {
  amount?: number | null;
  code: string;
  completedOn?: string | null;
  contractor?: string | null;
  location?: unknown | null;
  media: InsightsPlaceCivicProjectsMedia;
  name: string;
  startedOn: string;
  status: string;
  unit: string;
  unitId: string;
  unitPath: string;
}
