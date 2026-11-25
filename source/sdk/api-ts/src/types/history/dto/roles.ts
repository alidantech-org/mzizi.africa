/** Who and what took part in a historical occurrence, and how. */
export interface HistoryRoles {
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  identityId: string;
  occurrenceId: string;
  roleTerm: string;
  updatedAt: string;
  version: number;
}
