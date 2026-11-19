import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type LeaderTreeLevels } from "#/_archives/lib/types/leader-tree-levels";
import { type PlaceCrumb } from "#/_archives/lib/types/place-crumb";

/** Leader Tree */
export interface LeaderTree {
  gaps: string[];
  levels: LeaderTreeLevels[];
  place?: PlaceCrumb | null;
}

/** Field metadata for forms and results. */
export const LeaderTreeFields: readonly FieldMeta[] = [
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "levels", label: "Levels", kind: "other", required: true },
  { name: "place", label: "Place", kind: "other", required: false },
];
