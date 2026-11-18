import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type PlaceCrumb } from "#/lib/types/place-crumb.ts";

/** Leader Tree */
export interface LeaderTree {
  gaps: string[];
  levels: unknown[];
  place?: PlaceCrumb | null;
}

/** Field metadata for forms and results. */
export const LeaderTreeFields: readonly FieldMeta[] = [
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "levels", label: "Levels", kind: "other", required: true },
  { name: "place", label: "Place", kind: "other", required: false },
];
