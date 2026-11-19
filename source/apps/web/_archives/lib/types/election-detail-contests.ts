import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Election Detail Contests */
export interface ElectionDetailContests {
  contests: number;
  kind: string;
}

/** Field metadata for forms and results. */
export const ElectionDetailContestsFields: readonly FieldMeta[] = [
  { name: "contests", label: "Contests", kind: "number", required: true },
  { name: "kind", label: "Kind", kind: "string", required: true },
];
