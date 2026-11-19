import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type PartyListParties } from "#/_archives/lib/types/party-list-parties";

/** Party List */
export interface PartyList {
  gaps: string[];
  parties: PartyListParties[];
}

/** Field metadata for forms and results. */
export const PartyListFields: readonly FieldMeta[] = [
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "parties", label: "Parties", kind: "other", required: true },
];
