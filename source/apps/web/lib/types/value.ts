import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** A controlled classification member within one scheme, with optional supersession and an optional broader parent value in the same scheme. Wider, cross-scheme or many-parent links use value relations. */
export interface Value {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  label: string;
  parentId?: string | null;
  position?: number | null;
  schemeId: string;
  supersedesId?: string | null;
  updatedAt: string;
  version: number;
}

/** Field metadata for forms and results. */
export const ValueFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "deletedAt", label: "Deleted At", kind: "date", required: false },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "label", label: "Label", kind: "string", required: true },
  { name: "parentId", label: "Parent Id", kind: "string", required: false },
  { name: "position", label: "Position", kind: "number", required: false },
  { name: "schemeId", label: "Scheme Id", kind: "string", required: true },
  { name: "supersedesId", label: "Supersedes Id", kind: "string", required: false },
  { name: "updatedAt", label: "Updated At", kind: "date", required: true },
  { name: "version", label: "Version", kind: "number", required: true },
];
