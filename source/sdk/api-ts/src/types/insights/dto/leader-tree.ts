import type { InsightsLeaderTreeLevels } from "#sdk/types/insights/dto/leader-tree-levels.ts";
import type { InsightsPlaceCrumb } from "#sdk/types/insights/dto/place-crumb.ts";

/** Leader Tree */
export interface InsightsLeaderTree {
  gaps: string[];
  levels: InsightsLeaderTreeLevels[];
  place?: InsightsPlaceCrumb | null;
}
