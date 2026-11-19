import type { InsightsLeaderProfileActivity } from "#sdk/types/insights/leader-profile-activity.ts";
import type { InsightsLeaderProfileContacts } from "#sdk/types/insights/leader-profile-contacts.ts";
import type { InsightsLeaderProfileElection } from "#sdk/types/insights/leader-profile-election.ts";
import type { InsightsLeaderProfileEvidence } from "#sdk/types/insights/leader-profile-evidence.ts";
import type { InsightsLeaderProfileLeader } from "#sdk/types/insights/leader-profile-leader.ts";
import type { InsightsLeaderProfileMedia } from "#sdk/types/insights/leader-profile-media.ts";
import type { InsightsLeaderProfileOffices } from "#sdk/types/insights/leader-profile-offices.ts";

/** Leader Profile */
export interface InsightsLeaderProfile {
  activity: InsightsLeaderProfileActivity;
  contacts: InsightsLeaderProfileContacts[];
  election: InsightsLeaderProfileElection[];
  evidence: InsightsLeaderProfileEvidence[];
  fund: unknown;
  gaps: string[];
  leader: InsightsLeaderProfileLeader;
  media: InsightsLeaderProfileMedia[];
  offices: InsightsLeaderProfileOffices[];
}
