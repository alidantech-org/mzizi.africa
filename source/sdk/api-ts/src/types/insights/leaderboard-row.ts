/** Leaderboard Row */
export interface InsightsLeaderboardRow {
  detail?: string | null;
  featureId?: string | null;
  name: string;
  rank: number;
  share?: number | null;
  subjectId?: string | null;
  value: number;
}
