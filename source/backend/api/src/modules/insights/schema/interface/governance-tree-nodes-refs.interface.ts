import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Governance Tree Nodes Refs */
export interface GovernanceTreeNodesRefs {
  appointment?: String;
  basis?: String;
  code?: String;
  institution?: String;
  office?: String;
  scheme: String;
  table?: String;
  tier?: String;
  value?: String;
}
