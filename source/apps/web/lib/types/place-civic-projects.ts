import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type PlaceCivicProjectsMedia } from "#/lib/types/place-civic-projects-media.ts";

/** Place Civic Projects */
export interface PlaceCivicProjects {
  amount?: number | null;
  code: string;
  completedOn?: string | null;
  contractor?: string | null;
  location?: unknown | null;
  media: PlaceCivicProjectsMedia;
  name: string;
  startedOn: string;
  status: string;
  unit: string;
  unitId: string;
  unitPath: string;
}

/** Field metadata for forms and results. */
export const PlaceCivicProjectsFields: readonly FieldMeta[] = [
  { name: "amount", label: "Amount", kind: "number", required: false },
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "completedOn", label: "Completed On", kind: "string", required: false },
  { name: "contractor", label: "Contractor", kind: "string", required: false },
  { name: "location", label: "Location", kind: "other", required: false },
  { name: "media", label: "Media", kind: "other", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "startedOn", label: "Started On", kind: "string", required: true },
  { name: "status", label: "Status", kind: "string", required: true },
  { name: "unit", label: "Unit", kind: "string", required: true },
  { name: "unitId", label: "Unit Id", kind: "string", required: true },
  { name: "unitPath", label: "Unit Path", kind: "string", required: true },
];
