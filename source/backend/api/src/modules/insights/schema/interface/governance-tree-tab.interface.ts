import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Governance Tree Tab */
export interface GovernanceTreeTab {
  about: String;
  code: String;
  institution?: String | null;
  label: String;
}
