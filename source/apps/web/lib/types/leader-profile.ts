import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type LeaderProfileActivity } from "#/lib/types/leader-profile-activity.ts";
import { type LeaderProfileContacts } from "#/lib/types/leader-profile-contacts.ts";
import { type LeaderProfileElection } from "#/lib/types/leader-profile-election.ts";
import { type LeaderProfileEvidence } from "#/lib/types/leader-profile-evidence.ts";
import { type LeaderProfileLeader } from "#/lib/types/leader-profile-leader.ts";
import { type LeaderProfileMedia } from "#/lib/types/leader-profile-media.ts";
import { type LeaderProfileOffices } from "#/lib/types/leader-profile-offices.ts";

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
