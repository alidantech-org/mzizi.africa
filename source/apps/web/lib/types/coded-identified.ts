import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Base for operational records with a unique identity code. */
export interface CodedIdentified {
  code: string;
  id: string;
}

/** Field metadata for forms and results. */
export const CodedIdentifiedFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "id", label: "Id", kind: "string", required: true },
];
