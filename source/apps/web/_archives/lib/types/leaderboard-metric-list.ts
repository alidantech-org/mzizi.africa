import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type LeaderboardMetric } from "#/_archives/lib/types/leaderboard-metric";

/** Leaderboard Metric List */
export interface LeaderboardMetricList {
  metrics: LeaderboardMetric[];
}

/** Field metadata for forms and results. */
export const LeaderboardMetricListFields: readonly FieldMeta[] = [
  { name: "metrics", label: "Metrics", kind: "other", required: true },
];
