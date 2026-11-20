"use server";
/** Generated HTTP request helpers. Endpoint spelling belongs exclusively to routes.ts. */
import { type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import { api } from "#sdk/helpers/api.ts";
import { routes } from "#sdk/routes.ts";
import type { ExperienceCalendarInput } from "#sdk/types/experience/dto/calendar-input.ts";
import type { ExperienceCalendar } from "#sdk/types/experience/dto/calendar.ts";
import type { ExperienceContext } from "#sdk/types/experience/dto/context.ts";
import type { ExperienceCopyCatalog } from "#sdk/types/experience/dto/copy-catalog.ts";
import type { ExperienceCopyInput } from "#sdk/types/experience/dto/copy-input.ts";
import type { ExperienceFacilitiesInput } from "#sdk/types/experience/dto/facilities-input.ts";
import type { ExperienceFacilityDetail } from "#sdk/types/experience/dto/facility-detail.ts";
import type { ExperienceFacilityList } from "#sdk/types/experience/dto/facility-list.ts";
import type { ExperienceFactList } from "#sdk/types/experience/dto/fact-list.ts";
import type { ExperienceFactsInput } from "#sdk/types/experience/dto/facts-input.ts";
/** GET /v1/calendar */
export type ExperienceGetCalendarActionInput = ActionInput<never, ExperienceCalendarInput, never>;

export async function experienceGetCalendar(input: ExperienceGetCalendarActionInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.experience.getCalendar;
  return api.get<ExperienceCalendar>(path, options);
}
/** GET /v1/context */
export type ExperienceGetContextActionInput = ActionInput<
  never,
  { countryCode?: string; languageCode?: string; path?: string; featureId?: string },
  never
>;

export async function experienceGetContext(input: ExperienceGetContextActionInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.experience.getContext;
  return api.get<ExperienceContext>(path, options);
}
/** GET /v1/copy */
export type ExperienceGetCopyActionInput = ActionInput<never, ExperienceCopyInput, never>;

export async function experienceGetCopy(input: ExperienceGetCopyActionInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.experience.getCopy;
  return api.get<ExperienceCopyCatalog>(path, options);
}
/** GET /v1/facilities/{code} */
export type ExperienceGetFacilityActionInput = ActionInput<
  { code: string },
  { languageCode?: string },
  never
>;

export async function experienceGetFacility(input: ExperienceGetFacilityActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.experience.getFacility(input.params);
  return api.get<ExperienceFacilityDetail>(path, options);
}
/** GET /v1/facilities */
export type ExperienceListFacilitiesActionInput = ActionInput<
  never,
  ExperienceFacilitiesInput,
  never
>;

export async function experienceListFacilities(input: ExperienceListFacilitiesActionInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.experience.listFacilities;
  return api.get<ExperienceFacilityList>(path, options);
}
/** GET /v1/facts */
export type ExperienceListFactsActionInput = ActionInput<never, ExperienceFactsInput, never>;

export async function experienceListFacts(input: ExperienceListFactsActionInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.experience.listFacts;
  return api.get<ExperienceFactList>(path, options);
}
