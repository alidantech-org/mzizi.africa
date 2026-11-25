/** Who took part in an occurrence. */
export interface EventParticipants {
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  identityId: string;
  occurrenceId: string;
  roleTerm: string;
}
