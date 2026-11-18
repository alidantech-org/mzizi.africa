import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type ClassCount } from "#/lib/types/class-count.ts";
import { type FacilityRow } from "#/lib/types/facility-row.ts";

/** Facility List */
export interface FacilityList {
  classes: ClassCount[];
  facilities: FacilityRow[];
  gaps: string[];
  total: number;
}

/** Field metadata for forms and results. */
export const FacilityListFields: readonly FieldMeta[] = [
  { name: "classes", label: "Classes", kind: "other", required: true },
  { name: "facilities", label: "Facilities", kind: "other", required: true },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "total", label: "Total", kind: "number", required: true },
];
