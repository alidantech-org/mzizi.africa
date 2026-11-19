import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type ElectionListElections } from "#/_archives/lib/types/election-list-elections";

/** Election List */
export interface ElectionList {
  elections: ElectionListElections[];
}

/** Field metadata for forms and results. */
export const ElectionListFields: readonly FieldMeta[] = [
  { name: "elections", label: "Elections", kind: "other", required: true },
];
