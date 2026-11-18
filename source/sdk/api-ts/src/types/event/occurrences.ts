/** One dated instance of an event with its planned and actual dates, status, how we know the date, venue and format. Planned dates are never overwritten; changes are recorded. */
export interface EventOccurrences {
  actualEndsOn?: string | null;
  actualStartsOn?: string | null;
  code: string;
  continuesOccurrenceId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  eventId: string;
  formatId?: string | null;
  id: string;
  isAllDay: boolean;
  knowledgeId: string;
  organiserEntityId?: string | null;
  plannedEndsOn?: string | null;
  plannedStartsOn: string;
  sourceCitationId?: string | null;
  startsAt?: string | null;
  statusId: string;
  timezone?: string | null;
  updatedAt: string;
  venueFeatureId?: string | null;
  venueNote?: string | null;
  version: number;
}
