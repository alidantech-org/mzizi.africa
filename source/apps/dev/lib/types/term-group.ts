import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Term Group */
export interface TermGroup {
  domain: string;
  group: string;
  label: string;
  terms: string[];
}

/** Field metadata for forms and results. */
export const TermGroupFields: readonly FieldMeta[] = [
  { name: "domain", label: "Domain", kind: "string", required: true },
  { name: "group", label: "Group", kind: "string", required: true },
  { name: "label", label: "Label", kind: "string", required: true },
  { name: "terms", label: "Terms", kind: "string", required: true },
];
