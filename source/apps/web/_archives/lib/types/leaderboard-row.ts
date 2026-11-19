import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Leaderboard Row */
export interface LeaderboardRow {
  detail?: string | null;
  featureId?: string | null;
  name: string;
  rank: number;
  share?: number | null;
  subjectId?: string | null;
  value: number;
}

/** Field metadata for forms and results. */
export const LeaderboardRowFields: readonly FieldMeta[] = [
  { name: "detail", label: "Detail", kind: "string", required: false },
  { name: "featureId", label: "Feature Id", kind: "string", required: false },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "rank", label: "Rank", kind: "number", required: true },
  { name: "share", label: "Share", kind: "number", required: false },
  { name: "subjectId", label: "Subject Id", kind: "string", required: false },
  { name: "value", label: "Value", kind: "number", required: true },
];
