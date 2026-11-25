"use server";
/** Generated HTTP request helpers. Endpoint spelling belongs exclusively to routes.ts. */
import { type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import { api } from "#sdk/helpers/api.ts";
import { routes } from "#sdk/routes.ts";
import type { HistoryCountryTimeline } from "#sdk/types/history/dto/country-timeline.ts";
import type { HistoryEraCollection } from "#sdk/types/history/dto/era-collection.ts";
import type { HistoryHistoryCollection } from "#sdk/types/history/dto/history-collection.ts";
/** GET /v1/history/eras */
export type HistoryListErasActionInput = ActionInput<never, HistoryCountryTimeline, never>;

export async function historyListEras(input: HistoryListErasActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.history.listEras;
  return api.get<HistoryEraCollection>(path, options);
}
/** GET /v1/history/occurrences */
export type HistoryListHistoryActionInput = ActionInput<never, HistoryCountryTimeline, never>;

export async function historyListHistory(input: HistoryListHistoryActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.history.listHistory;
  return api.get<HistoryHistoryCollection>(path, options);
}
