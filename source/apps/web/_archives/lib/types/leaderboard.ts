import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type LeaderboardMetric } from "#/_archives/lib/types/leaderboard-metric";
import { type LeaderboardRow } from "#/_archives/lib/types/leaderboard-row";

/** Leaderboard */
export interface Leaderboard {
  gaps: string[];
  metric: LeaderboardMetric;
  rows: LeaderboardRow[];
  scope: string;
}

/** Field metadata for forms and results. */
export const LeaderboardFields: readonly FieldMeta[] = [
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "metric", label: "Metric", kind: "other", required: true },
  { name: "rows", label: "Rows", kind: "other", required: true },
  { name: "scope", label: "Scope", kind: "string", required: true },
];
