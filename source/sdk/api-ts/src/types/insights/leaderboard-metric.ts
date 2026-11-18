/** Leaderboard Metric */
export interface InsightsLeaderboardMetric {
  code: string;
  describe: string;
  domain: string;
  higherIsBetter: boolean;
  title: string;
  unit?: string | null;
}
