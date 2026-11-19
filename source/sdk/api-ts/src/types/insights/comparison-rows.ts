/** Comparison Rows */
export interface InsightsComparisonRows {
  a: number;
  b: number;
  code: string;
  diffPercent?: number | null;
  higherIsBetter: boolean;
  title: string;
  unit: string;
}
