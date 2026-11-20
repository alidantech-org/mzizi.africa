import type { InsightsLeaderProfileActivityContributions } from "#sdk/types/insights/dto/leader-profile-activity-contributions.ts";
import type { InsightsLeaderProfileActivityRecent } from "#sdk/types/insights/dto/leader-profile-activity-recent.ts";
import type { InsightsLeaderProfileActivitySpeeches } from "#sdk/types/insights/dto/leader-profile-activity-speeches.ts";
import type { InsightsLeaderProfileActivityVotes } from "#sdk/types/insights/dto/leader-profile-activity-votes.ts";

/** Leader Profile Activity */
export interface InsightsLeaderProfileActivity {
  contributions: InsightsLeaderProfileActivityContributions;
  recent: InsightsLeaderProfileActivityRecent[];
  recorded: boolean;
  speeches: InsightsLeaderProfileActivitySpeeches[];
  votes: InsightsLeaderProfileActivityVotes;
}
