import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Place Civic Infrastructure */
export interface PlaceCivicInfrastructure {
  areaKm2?: number | null;
  completed: number;
  completionRate?: number | null;
  per100k?: number | null;
  perKm2?: number | null;
  population?: number | null;
  projectShare?: number | null;
  projects: number;
  staffShare?: number | null;
}

/** Field metadata for forms and results. */
export const PlaceCivicInfrastructureFields: readonly FieldMeta[] = [
  { name: "areaKm2", label: "Area Km2", kind: "number", required: false },
  { name: "completed", label: "Completed", kind: "number", required: true },
  { name: "completionRate", label: "Completion Rate", kind: "number", required: false },
  { name: "per100k", label: "Per100k", kind: "number", required: false },
  { name: "perKm2", label: "Per Km2", kind: "number", required: false },
  { name: "population", label: "Population", kind: "number", required: false },
  { name: "projectShare", label: "Project Share", kind: "number", required: false },
  { name: "projects", label: "Projects", kind: "number", required: true },
  { name: "staffShare", label: "Staff Share", kind: "number", required: false },
];
