import type { EventOccurrenceEntryNames } from "#sdk/types/event/dto/occurrence-entry-names.ts";

/** Occurrence Entry */
export interface EventOccurrenceEntry {
  actualStartsOn: string | null;
  eventCode: string;
  eventId: string;
  featureId: string | null;
  isAllDay: boolean;
  kindTerm: string;
  names: EventOccurrenceEntryNames[];
  occurrenceId: string;
  plannedEndsOn: string | null;
  plannedStartsOn: string;
  startsAt: string | null;
  statusTerm: string;
}
