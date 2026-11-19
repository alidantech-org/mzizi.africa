import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";
import type { LeaderTreeLevelsUnit } from "#/modules/insights/schema/interface/leader-tree-levels-unit.interface.ts";

/** Leader Tree Levels */
export interface LeaderTreeLevels {
  groups: unknown;
  label: String;
  level: String;
  total: Number;
  unit?: LeaderTreeLevelsUnit | null;
}
