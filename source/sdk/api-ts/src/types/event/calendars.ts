/** A way of counting time that gives events their dates: the civil calendar, a lunar calendar, a fiscal or school year. */
export interface EventCalendars {
  calendarKindId: string;
  code: string;
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  description?: string | null;
  id: string;
  isObserved: boolean;
  sourceCitationId?: string | null;
  updatedAt: string;
  version: number;
  yearStartDay?: number | null;
  yearStartMonth?: number | null;
}
