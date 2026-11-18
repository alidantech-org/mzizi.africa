import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type LeaderboardMetric } from "#/lib/types/leaderboard-metric.ts";

/** Leaderboard Metric List */
export interface LeaderboardMetricList {
  metrics: LeaderboardMetric[];
}

/** Field metadata for forms and results. */
export const LeaderboardMetricListFields: readonly FieldMeta[] = [
  { name: "metrics", label: "Metrics", kind: "other", required: true },
];
