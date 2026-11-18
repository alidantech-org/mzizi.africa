import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Nearby Projects */
export interface NearbyProjects {
  gaps: string[];
  projects: unknown[];
  radiusKm: number;
}

/** Field metadata for forms and results. */
export const NearbyProjectsFields: readonly FieldMeta[] = [
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "projects", label: "Projects", kind: "other", required: true },
  { name: "radiusKm", label: "Radius Km", kind: "number", required: true },
];
