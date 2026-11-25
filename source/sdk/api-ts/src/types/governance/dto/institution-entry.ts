import type { GovernanceInstitutionEntryNames } from "#sdk/types/governance/dto/institution-entry-names.ts";

/** Institution Entry */
export interface GovernanceInstitutionEntry {
  armTerm: string | null;
  classTerm: string | null;
  code: string;
  fromYear: number | null;
  institutionId: string;
  kindTerm: string;
  names: GovernanceInstitutionEntryNames[];
  toYear: number | null;
}
