import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type PartyDetailFunding } from "#/_archives/lib/types/party-detail-funding";
import { type PartyDetailMembers } from "#/_archives/lib/types/party-detail-members";
import { type PartyDetailParty } from "#/_archives/lib/types/party-detail-party";
import { type PartyDetailResults } from "#/_archives/lib/types/party-detail-results";

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
