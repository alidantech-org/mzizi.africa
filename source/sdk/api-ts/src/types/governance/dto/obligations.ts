import { GovernanceFrequency } from "#sdk/types/governance/enums/frequency.ts";

/** A duty to report that law sets; its explanation is a definition name. */
export interface GovernanceObligations {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  frequency: GovernanceFrequency;
  holderId: string;
  id: string;
  kindTerm: string;
  provisionId?: string | null;
  recipientId: string;
  updatedAt: string;
  version: number;
}
