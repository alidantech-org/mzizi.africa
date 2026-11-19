import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Institution Detail Leaders Tier */
export interface InstitutionDetailLeadersTier {
  code: string;
  label: string;
  parent?: string | null;
}

/** Field metadata for forms and results. */
export const InstitutionDetailLeadersTierFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "label", label: "Label", kind: "string", required: true },
  { name: "parent", label: "Parent", kind: "string", required: false },
];
