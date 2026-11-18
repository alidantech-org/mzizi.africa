import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type LeaderboardMetric } from "#/lib/types/leaderboard-metric.ts";
import { type LeaderboardRow } from "#/lib/types/leaderboard-row.ts";

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
