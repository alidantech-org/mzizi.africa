import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Governance Tabs Tabs */
export interface GovernanceTabsTabs {
  about: String;
  code: String;
  count: Number;
  includes: String[];
  kind: String;
  label: String;
}
