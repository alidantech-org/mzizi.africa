/** One step of a schedule. */
export interface EventItems {
  countsWorkingDays: boolean;
  createdAt: string;
  deletedAt?: string | null;
  eventId: string;
  id: string;
  note?: string | null;
  noteLanguageId?: string | null;
  occurrenceId?: string | null;
  offsetDays?: number | null;
  position: number;
  scheduleId: string;
  updatedAt: string;
  version: number;
}
