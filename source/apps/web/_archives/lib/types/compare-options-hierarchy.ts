import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type CompareOptionsHierarchyUnit } from "#/_archives/lib/types/compare-options-hierarchy-unit";

/** Compare Options Hierarchy */
export interface CompareOptionsHierarchy {
  available: boolean;
  label: string;
  message?: string | null;
  rung: string;
  unit?: CompareOptionsHierarchyUnit | null;
}

/** Field metadata for forms and results. */
export const CompareOptionsHierarchyFields: readonly FieldMeta[] = [
  { name: "available", label: "Available", kind: "boolean", required: true },
  { name: "label", label: "Label", kind: "string", required: true },
  { name: "message", label: "Message", kind: "string", required: false },
  { name: "rung", label: "Rung", kind: "string", required: true },
  { name: "unit", label: "Unit", kind: "other", required: false },
];
