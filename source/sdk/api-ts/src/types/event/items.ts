/** One line of a schedule: an event placed at an offset from the anchor, and the occurrence it became. */
export interface EventItems {
  countsWorkingDays: boolean;
  createdAt: string;
  deletedAt?: string | null;
  eventId: string;
  id: string;
  note?: string | null;
  occurrenceId?: string | null;
  offsetDays?: number | null;
  position: number;
  scheduleId: string;
  updatedAt: string;
  version: number;
}
