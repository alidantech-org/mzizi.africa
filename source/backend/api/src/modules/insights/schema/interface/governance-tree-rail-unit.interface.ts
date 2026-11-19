import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Governance Tree Rail Unit */
export interface GovernanceTreeRailUnit {
  featureId: String;
  kindCode: String;
  kindLabel: String;
  name: String;
  path?: String;
}
