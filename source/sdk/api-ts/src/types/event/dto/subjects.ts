/** What an event is about. */
export interface EventSubjects {
  createdAt: string;
  deletedAt?: string | null;
  eventId: string;
  id: string;
  identityId: string;
  roleTerm: string;
}
