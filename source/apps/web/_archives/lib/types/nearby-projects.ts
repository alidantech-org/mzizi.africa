import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type NearbyProjectsProjects } from "#/_archives/lib/types/nearby-projects-projects";

/** Nearby Projects */
export interface NearbyProjects {
  gaps: string[];
  projects: NearbyProjectsProjects[];
  radiusKm: number;
}

/** Field metadata for forms and results. */
export const NearbyProjectsFields: readonly FieldMeta[] = [
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "projects", label: "Projects", kind: "other", required: true },
  { name: "radiusKm", label: "Radius Km", kind: "number", required: true },
];
