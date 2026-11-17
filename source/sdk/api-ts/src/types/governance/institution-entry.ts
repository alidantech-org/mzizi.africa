import type { GovernanceInstitutionEntryNames } from "#sdk/types/governance/institution-entry-names.ts";

/** Institution Entry */
export interface GovernanceInstitutionEntry {
  code: string;
  id: string;
  kind: string;
  names: GovernanceInstitutionEntryNames[];
}
