/** A published plan of dated items: an election timetable, a school year, a parliamentary calendar. Items are placed by offset from an anchor, so moving the anchor moves the plan. */
export interface EventSchedules {
  anchorEventId?: string | null;
  anchorOn?: string | null;
  basisProvisionId?: string | null;
  code: string;
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  issuerEntityId?: string | null;
  publishedOn?: string | null;
  scheduleKindId: string;
  sourceCitationId?: string | null;
  statusId: string;
  supersedesScheduleId?: string | null;
  updatedAt: string;
  version: number;
}
