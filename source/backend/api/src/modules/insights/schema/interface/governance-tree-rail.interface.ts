import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";
import type { GovernanceTreeRailRefs } from "#/modules/insights/schema/interface/governance-tree-rail-refs.interface.ts";
import type { GovernanceTreeRailUnit } from "#/modules/insights/schema/interface/governance-tree-rail-unit.interface.ts";

/** Governance Tree Rail */
export interface GovernanceTreeRail {
  about: String;
  code: String;
  count: Number;
  label: String;
  refs: GovernanceTreeRailRefs;
  unit?: GovernanceTreeRailUnit | null;
}
