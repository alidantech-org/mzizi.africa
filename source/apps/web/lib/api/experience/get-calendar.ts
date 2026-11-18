import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { type CalendarInput, CalendarInputFields } from "#/lib/types/calendar-input.ts";
import { type Calendar, CalendarFields } from "#/lib/types/calendar.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getCalendarInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  input: CalendarInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const getCalendarOutputFields: readonly FieldMeta[] | undefined = CalendarFields;
/** This operation has no query plan, so no paging is known. */
export const getCalendarPage: PageNames | undefined = undefined;

/** Values for each input port of Get Calendar. */
export type GetCalendarPorts = {
  input?: CalendarInput;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getCalendarRequest(ports: GetCalendarPorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...(ports.input as Record<string, unknown> | undefined),
    },
  };
}

/**
 * Dated events for a range, with whether each date moved and how it is known, and the countdown to the next general election with its timetable milestones.
 *
 * GET /v1/calendar. Used when no operation.client pack is bound.
 */
export async function getCalendar(input: ClientInput = {}): Promise<ClientResponse<Calendar>> {
  const path = "/v1/calendar";
  return send("GET", path, input);
}
