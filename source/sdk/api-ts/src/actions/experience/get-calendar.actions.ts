"use server";

/**
 * Dated events for a range, with whether each date moved and how it is known, and the countdown to the next general election with its timetable milestones.
 *
 * GET /v1/calendar
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { ExperienceCalendarInput } from "#sdk/types/experience/calendar-input.ts";
import type { ExperienceCalendar } from "#sdk/types/experience/calendar.ts";

export type GetCalendarInput = ActionInput<never, ExperienceCalendarInput, never>;

export async function getCalendar(input: GetCalendarInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/calendar";
  return api.get<ExperienceCalendar>(path, options);
}
