import type { EventOccurrenceEntry } from "#sdk/types/event/dto/occurrence-entry.ts";

/** Occurrence Collection */
export interface EventOccurrenceCollection {
  occurrences: EventOccurrenceEntry[];
}
