import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type PartyDetailFunding } from "#/lib/types/party-detail-funding.ts";
import { type PartyDetailMembers } from "#/lib/types/party-detail-members.ts";
import { type PartyDetailParty } from "#/lib/types/party-detail-party.ts";
import { type PartyDetailResults } from "#/lib/types/party-detail-results.ts";

/** Party Detail */
export interface PartyDetail {
  funding: PartyDetailFunding[];
  gaps: string[];
  members: PartyDetailMembers[];
  party: PartyDetailParty;
  results: PartyDetailResults[];
}

/** Field metadata for forms and results. */
export const PartyDetailFields: readonly FieldMeta[] = [
  { name: "funding", label: "Funding", kind: "other", required: true },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "members", label: "Members", kind: "other", required: true },
  { name: "party", label: "Party", kind: "other", required: true },
  { name: "results", label: "Results", kind: "other", required: true },
];
