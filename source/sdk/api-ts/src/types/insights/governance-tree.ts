import type { InsightsPlaceCrumb } from "#sdk/types/insights/place-crumb.ts";

/** Governance Tree */
export interface InsightsGovernanceTree {
  edges: unknown[];
  gaps: string[];
  legend: unknown[];
  nodes: unknown[];
  place?: InsightsPlaceCrumb | null;
  rail: unknown[];
  tab: unknown;
}
