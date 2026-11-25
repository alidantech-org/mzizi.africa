"use server";
/** Generated HTTP request helpers. Endpoint spelling belongs exclusively to routes.ts. */
import { type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import { api } from "#sdk/helpers/api.ts";
import { routes } from "#sdk/routes.ts";
import type { EventCalendarWindow } from "#sdk/types/event/dto/calendar-window.ts";
import type { EventOccurrenceCollection } from "#sdk/types/event/dto/occurrence-collection.ts";
/** GET /v1/event/occurrences */
export type EventListOccurrencesActionInput = ActionInput<never, EventCalendarWindow, never>;

export async function eventListOccurrences(input: EventListOccurrencesActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.event.listOccurrences;
  return api.get<EventOccurrenceCollection>(path, options);
}
