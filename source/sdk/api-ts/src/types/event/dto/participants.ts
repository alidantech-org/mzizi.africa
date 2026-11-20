/** One organisation or person taking part in one occurrence in a role. */
export interface EventParticipants {
  createdAt: string;
  deletedAt?: string | null;
  entityId?: string | null;
  id: string;
  individualId?: string | null;
  occurrenceId: string;
  roleId: string;
  updatedAt: string;
  version: number;
}
