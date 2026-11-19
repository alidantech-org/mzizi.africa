import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type LeaderProfileActivity } from "#/_archives/lib/types/leader-profile-activity";
import { type LeaderProfileContacts } from "#/_archives/lib/types/leader-profile-contacts";
import { type LeaderProfileElection } from "#/_archives/lib/types/leader-profile-election";
import { type LeaderProfileEvidence } from "#/_archives/lib/types/leader-profile-evidence";
import { type LeaderProfileLeader } from "#/_archives/lib/types/leader-profile-leader";
import { type LeaderProfileMedia } from "#/_archives/lib/types/leader-profile-media";
import { type LeaderProfileOffices } from "#/_archives/lib/types/leader-profile-offices";

/** Leader Profile */
export interface LeaderProfile {
  activity: LeaderProfileActivity;
  contacts: LeaderProfileContacts[];
  election: LeaderProfileElection[];
  evidence: LeaderProfileEvidence[];
  fund: unknown;
  gaps: string[];
  leader: LeaderProfileLeader;
  media: LeaderProfileMedia[];
  offices: LeaderProfileOffices[];
}

/** Field metadata for forms and results. */
export const LeaderProfileFields: readonly FieldMeta[] = [
  { name: "activity", label: "Activity", kind: "other", required: true },
  { name: "contacts", label: "Contacts", kind: "other", required: true },
  { name: "election", label: "Election", kind: "other", required: true },
  { name: "evidence", label: "Evidence", kind: "other", required: true },
  { name: "fund", label: "Fund", kind: "other", required: true },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "leader", label: "Leader", kind: "other", required: true },
  { name: "media", label: "Media", kind: "other", required: true },
  { name: "offices", label: "Offices", kind: "other", required: true },
];
