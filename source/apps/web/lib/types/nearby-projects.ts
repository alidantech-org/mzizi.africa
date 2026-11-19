import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type NearbyProjectsProjects } from "#/lib/types/nearby-projects-projects.ts";

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
