import type { GovernanceRelationshipEntryNames } from "#sdk/types/governance/dto/relationship-entry-names.ts";

/** Relationship Entry */
export interface GovernanceRelationshipEntry {
  fromCode: string;
  fromId: string;
  fromYear: number | null;
  kindTerm: string;
  names: GovernanceRelationshipEntryNames[];
  toYear: number | null;
}
