import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type ColumnPlan } from "#/lib/types/column-plan.ts";

/** Prepare Request */
export interface PrepareRequest {
  columns: ColumnPlan[];
  path: string;
  root: string;
  saveAs?: string;
  skipEmptyRows?: boolean;
}

/** Field metadata for forms and results. */
export const PrepareRequestFields: readonly FieldMeta[] = [
  { name: "columns", label: "Columns", kind: "other", required: true },
  { name: "path", label: "Path", kind: "string", required: true },
  { name: "root", label: "Root", kind: "string", required: true },
  { name: "saveAs", label: "Save As", kind: "string", required: false },
  { name: "skipEmptyRows", label: "Skip Empty Rows", kind: "boolean", required: false },
];
