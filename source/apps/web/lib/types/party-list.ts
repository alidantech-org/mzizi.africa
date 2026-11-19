import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type PartyListParties } from "#/lib/types/party-list-parties.ts";

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
