import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Context Level */
export interface ContextLevel {
  depth: number;
  isRouting: boolean;
  kindCode: string;
  kindLabel: string;
}

/** Field metadata for forms and results. */
export const ContextLevelFields: readonly FieldMeta[] = [
  { name: "depth", label: "Depth", kind: "number", required: true },
  { name: "isRouting", label: "Is Routing", kind: "boolean", required: true },
  { name: "kindCode", label: "Kind Code", kind: "string", required: true },
  { name: "kindLabel", label: "Kind Label", kind: "string", required: true },
];
