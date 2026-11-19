import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { LeaderTreeLevels } from "#/modules/insights/schema/interface/leader-tree-levels.interface.ts";
import type { PlaceCrumb } from "#/modules/insights/schema/interface/place-crumb.interface.ts";

/** Leader Tree */
export interface LeaderTree {
  gaps: NonEmptyString500[];
  levels: LeaderTreeLevels[];
  place?: PlaceCrumb | null;
}
