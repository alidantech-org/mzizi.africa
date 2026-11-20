import type { InsightsGovernanceTreeRailRefs } from "#sdk/types/insights/dto/governance-tree-rail-refs.ts";
import type { InsightsGovernanceTreeRailUnit } from "#sdk/types/insights/dto/governance-tree-rail-unit.ts";

/** Governance Tree Rail */
export interface InsightsGovernanceTreeRail {
  about: string;
  code: string;
  count: number;
  label: string;
  refs: InsightsGovernanceTreeRailRefs;
  unit?: InsightsGovernanceTreeRailUnit | null;
}
