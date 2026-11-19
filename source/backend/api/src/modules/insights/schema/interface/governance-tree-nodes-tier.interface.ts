import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Governance Tree Nodes Tier */
export interface GovernanceTreeNodesTier {
  code: String;
  label: String;
  position?: Number | null;
}
