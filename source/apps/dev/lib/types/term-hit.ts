import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Term Hit */
export interface TermHit {
  domain: string;
  group: string;
  surface: string;
  term: string;
}

/** Field metadata for forms and results. */
export const TermHitFields: readonly FieldMeta[] = [
  { name: "domain", label: "Domain", kind: "string", required: true },
  { name: "group", label: "Group", kind: "string", required: true },
  { name: "surface", label: "Surface", kind: "string", required: true },
  { name: "term", label: "Term", kind: "string", required: true },
];
