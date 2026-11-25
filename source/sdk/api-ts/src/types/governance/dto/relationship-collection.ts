import type { GovernanceRelationshipEntry } from "#sdk/types/governance/dto/relationship-entry.ts";

/** Relationship Collection */
export interface GovernanceRelationshipCollection {
  relationships: GovernanceRelationshipEntry[];
}
