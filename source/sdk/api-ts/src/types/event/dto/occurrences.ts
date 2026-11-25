/** One happening of an event, with planned and actual dates. */
export interface EventOccurrences {
  actualEndsOn?: string | null;
  actualStartsOn?: string | null;
  code: string;
  continuesOccurrenceId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  eventId: string;
  formatTerm?: string | null;
  id: string;
  isAllDay: boolean;
  knowledgeTerm: string;
  organiserId?: string | null;
  plannedEndsOn?: string | null;
  plannedStartsOn: string;
  startsAt?: string | null;
  statusTerm: string;
  timezoneId?: string | null;
  updatedAt: string;
  version: number;
}
