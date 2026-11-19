import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Leader Profile Activity Recent */
export interface LeaderProfileActivityRecent {
  code: string;
  heldOn: string;
  outcome: string;
  position: string;
  title: string;
}

/** Field metadata for forms and results. */
export const LeaderProfileActivityRecentFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "heldOn", label: "Held On", kind: "string", required: true },
  { name: "outcome", label: "Outcome", kind: "string", required: true },
  { name: "position", label: "Position", kind: "string", required: true },
  { name: "title", label: "Title", kind: "string", required: true },
];
