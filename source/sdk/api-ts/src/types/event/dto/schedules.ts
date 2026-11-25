/** A published timetable of steps counted from an anchor (an election timetable). */
export interface EventSchedules {
  anchorEventId?: string | null;
  anchorOn?: string | null;
  basisProvisionId?: string | null;
  code: string;
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  issuerId?: string | null;
  kindTerm: string;
  publishedOn?: string | null;
  statusTerm: string;
  supersedesScheduleId?: string | null;
  updatedAt: string;
  version: number;
}
