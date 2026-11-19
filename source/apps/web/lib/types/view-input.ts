import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** View Input */
export interface ViewInput {
  subjectRef: string;
  subjectTable: string;
  visitor: string;
}

/** Field metadata for forms and results. */
export const ViewInputFields: readonly FieldMeta[] = [
  { name: "subjectRef", label: "Subject Ref", kind: "string", required: true },
  { name: "subjectTable", label: "Subject Table", kind: "string", required: true },
  { name: "visitor", label: "Visitor", kind: "string", required: true },
];
