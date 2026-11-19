import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { LeaderProfileActivityContributions } from "#/modules/insights/schema/interface/leader-profile-activity-contributions.interface.ts";
import type { LeaderProfileActivityRecent } from "#/modules/insights/schema/interface/leader-profile-activity-recent.interface.ts";
import type { LeaderProfileActivitySpeeches } from "#/modules/insights/schema/interface/leader-profile-activity-speeches.interface.ts";
import type { LeaderProfileActivityVotes } from "#/modules/insights/schema/interface/leader-profile-activity-votes.interface.ts";

/** Leader Profile Activity */
export interface LeaderProfileActivity {
  contributions: LeaderProfileActivityContributions;
  recent: LeaderProfileActivityRecent[];
  recorded: Flag;
  speeches: LeaderProfileActivitySpeeches[];
  votes: LeaderProfileActivityVotes;
}
