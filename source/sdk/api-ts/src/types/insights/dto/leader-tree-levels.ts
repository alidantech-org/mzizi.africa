import type { InsightsLeaderTreeLevelsUnit } from "#sdk/types/insights/dto/leader-tree-levels-unit.ts";

/** Leader Tree Levels */
export interface InsightsLeaderTreeLevels {
  groups: unknown;
  label: string;
  level: string;
  total: number;
  unit?: InsightsLeaderTreeLevelsUnit | null;
}
