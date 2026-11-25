/** A civic calendar, such as Kenya's public holidays or the National Assembly calendar. */
export interface EventCalendars {
  code: string;
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  isObserved: boolean;
  kindTerm: string;
  updatedAt: string;
  version: number;
  yearStartDay?: number | null;
  yearStartMonth?: number | null;
}
