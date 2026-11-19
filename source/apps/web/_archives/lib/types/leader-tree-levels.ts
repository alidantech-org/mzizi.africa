import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type LeaderTreeLevelsUnit } from "#/_archives/lib/types/leader-tree-levels-unit";

/** Leader Tree Levels */
export interface LeaderTreeLevels {
  groups: unknown;
  label: string;
  level: string;
  total: number;
  unit?: LeaderTreeLevelsUnit | null;
}

/** Field metadata for forms and results. */
export const LeaderTreeLevelsFields: readonly FieldMeta[] = [
  { name: "groups", label: "Groups", kind: "other", required: true },
  { name: "label", label: "Label", kind: "string", required: true },
  { name: "level", label: "Level", kind: "string", required: true },
  { name: "total", label: "Total", kind: "number", required: true },
  { name: "unit", label: "Unit", kind: "other", required: false },
];
