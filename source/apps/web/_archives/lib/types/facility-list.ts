import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type ClassCount } from "#/_archives/lib/types/class-count";
import { type FacilityRow } from "#/_archives/lib/types/facility-row";

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
