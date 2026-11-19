import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type NearbyProjectsProjectsMedia } from "#/_archives/lib/types/nearby-projects-projects-media";

/** Nearby Projects Projects */
export interface NearbyProjectsProjects {
  amount?: number | null;
  code: string;
  contractor?: string | null;
  distanceKm: number;
  location: unknown;
  media: NearbyProjectsProjectsMedia;
  name: string;
  responsible?: string | null;
  status: string;
  unit: string;
  unitId: string;
  unitPath: string;
}

/** Field metadata for forms and results. */
export const NearbyProjectsProjectsFields: readonly FieldMeta[] = [
  { name: "amount", label: "Amount", kind: "number", required: false },
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "contractor", label: "Contractor", kind: "string", required: false },
  { name: "distanceKm", label: "Distance Km", kind: "number", required: true },
  { name: "location", label: "Location", kind: "other", required: true },
  { name: "media", label: "Media", kind: "other", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  {
    name: "responsible",
    label: "Responsible",
    kind: "string",
    required: false,
  },
  { name: "status", label: "Status", kind: "string", required: true },
  { name: "unit", label: "Unit", kind: "string", required: true },
  { name: "unitId", label: "Unit Id", kind: "string", required: true },
  { name: "unitPath", label: "Unit Path", kind: "string", required: true },
];
