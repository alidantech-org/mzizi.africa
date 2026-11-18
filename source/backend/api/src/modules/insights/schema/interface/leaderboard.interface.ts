import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { LeaderboardMetric } from "#/modules/insights/schema/interface/leaderboard-metric.interface.ts";
import type { LeaderboardRow } from "#/modules/insights/schema/interface/leaderboard-row.interface.ts";

/** Leaderboard */
export interface Leaderboard {
  gaps: NonEmptyString500[];
  metric: LeaderboardMetric;
  rows: LeaderboardRow[];
  scope: NonEmptyString500;
}
