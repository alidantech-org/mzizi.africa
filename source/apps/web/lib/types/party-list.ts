import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Party List */
export interface PartyList {
  gaps: string[];
  parties: unknown[];
}

/** Field metadata for forms and results. */
export const PartyListFields: readonly FieldMeta[] = [
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "parties", label: "Parties", kind: "other", required: true },
];
