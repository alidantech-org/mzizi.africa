import type { InsightsLeaderboardMetric } from "#sdk/types/insights/dto/leaderboard-metric.ts";
import type { InsightsLeaderboardRow } from "#sdk/types/insights/dto/leaderboard-row.ts";

/** Leaderboard */
export interface InsightsLeaderboard {
  gaps: string[];
  metric: InsightsLeaderboardMetric;
  rows: InsightsLeaderboardRow[];
  scope: string;
}
