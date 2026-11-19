import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Leaderboard Metric */
export interface LeaderboardMetric {
  code: string;
  describe: string;
  domain: string;
  higherIsBetter: boolean;
  title: string;
  unit?: string | null;
}

/** Field metadata for forms and results. */
export const LeaderboardMetricFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "describe", label: "Describe", kind: "string", required: true },
  { name: "domain", label: "Domain", kind: "string", required: true },
  {
    name: "higherIsBetter",
    label: "Higher Is Better",
    kind: "boolean",
    required: true,
  },
  { name: "title", label: "Title", kind: "string", required: true },
  { name: "unit", label: "Unit", kind: "string", required: false },
];
