import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Found Member */
export interface FoundMember {
  code: string;
  id: string;
  label: string;
  scheme: string;
}

/** Field metadata for forms and results. */
export const FoundMemberFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "label", label: "Label", kind: "string", required: true },
  { name: "scheme", label: "Scheme", kind: "string", required: true },
];
