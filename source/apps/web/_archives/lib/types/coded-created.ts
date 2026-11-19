import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Base for operational records with a unique identity code and creation time. */
export interface CodedCreated {
  code: string;
  createdAt: string;
  id: string;
}

/** Field metadata for forms and results. */
export const CodedCreatedFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "id", label: "Id", kind: "string", required: true },
];
