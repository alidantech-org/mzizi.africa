/** A structural link from law: a ministry part of the executive, a committee part of its house. */
export interface GovernanceRelationships {
  createdAt: string;
  deletedAt?: string | null;
  fromId: string;
  fromYear?: number | null;
  id: string;
  kindTerm: string;
  provisionId?: string | null;
  toId: string;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
