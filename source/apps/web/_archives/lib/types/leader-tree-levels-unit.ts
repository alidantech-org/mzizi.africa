import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Leader Tree Levels Unit */
export interface LeaderTreeLevelsUnit {
  featureId: string;
  kindCode: string;
  kindLabel: string;
  name: string;
  path?: string;
}

/** Field metadata for forms and results. */
export const LeaderTreeLevelsUnitFields: readonly FieldMeta[] = [
  { name: "featureId", label: "Feature Id", kind: "string", required: true },
  { name: "kindCode", label: "Kind Code", kind: "string", required: true },
  { name: "kindLabel", label: "Kind Label", kind: "string", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "path", label: "Path", kind: "string", required: false },
];
