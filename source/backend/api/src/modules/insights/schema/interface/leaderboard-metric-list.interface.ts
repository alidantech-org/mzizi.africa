import type { LeaderboardMetric } from "#/modules/insights/schema/interface/leaderboard-metric.interface.ts";

/** Leaderboard Metric List */
export interface LeaderboardMetricList {
  metrics: LeaderboardMetric[];
}
