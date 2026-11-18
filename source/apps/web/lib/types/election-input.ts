import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Election Input */
export interface ElectionInput {
  contestKind?: string;
  electionId: string;
  parentFeatureId?: string;
}

/** Field metadata for forms and results. */
export const ElectionInputFields: readonly FieldMeta[] = [
  { name: "contestKind", label: "Contest Kind", kind: "string", required: false },
  { name: "electionId", label: "Election Id", kind: "string", required: true },
  { name: "parentFeatureId", label: "Parent Feature Id", kind: "string", required: false },
];
