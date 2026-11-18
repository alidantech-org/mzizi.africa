/** Calendar Event */
export interface ExperienceCalendarEvent {
  actualOn?: string | null;
  changeNote?: string | null;
  changeReason?: string | null;
  daysAway: number;
  eventCode: string;
  kindCode: string;
  kindLabel: string;
  knowledgeCode: string;
  knowledgeLabel: string;
  name: string;
  occurrenceCode: string;
  plannedOn: string;
  statusCode: string;
  statusLabel: string;
  venueCount: number;
}
