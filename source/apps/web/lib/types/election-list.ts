import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type ElectionListElections } from "#/lib/types/election-list-elections.ts";

/** Election List */
export interface ElectionList {
  elections: ElectionListElections[];
}

/** Field metadata for forms and results. */
export const ElectionListFields: readonly FieldMeta[] = [
  { name: "elections", label: "Elections", kind: "other", required: true },
];
