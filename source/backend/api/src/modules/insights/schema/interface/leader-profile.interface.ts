import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { LeaderProfileActivity } from "#/modules/insights/schema/interface/leader-profile-activity.interface.ts";
import type { LeaderProfileContacts } from "#/modules/insights/schema/interface/leader-profile-contacts.interface.ts";
import type { LeaderProfileElection } from "#/modules/insights/schema/interface/leader-profile-election.interface.ts";
import type { LeaderProfileEvidence } from "#/modules/insights/schema/interface/leader-profile-evidence.interface.ts";
import type { LeaderProfileLeader } from "#/modules/insights/schema/interface/leader-profile-leader.interface.ts";
import type { LeaderProfileMedia } from "#/modules/insights/schema/interface/leader-profile-media.interface.ts";
import type { LeaderProfileOffices } from "#/modules/insights/schema/interface/leader-profile-offices.interface.ts";

/** Leader Profile */
export interface LeaderProfile {
  activity: LeaderProfileActivity;
  contacts: LeaderProfileContacts[];
  election: LeaderProfileElection[];
  evidence: LeaderProfileEvidence[];
  fund: unknown;
  gaps: NonEmptyString500[];
  leader: LeaderProfileLeader;
  media: LeaderProfileMedia[];
  offices: LeaderProfileOffices[];
}
