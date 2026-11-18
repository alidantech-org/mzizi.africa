"use server";

/**
 * A run's events in order, optionally only those after a sequence number (for polling).
 *
 * GET /v1/run-events
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { RuntimeEventList } from "#sdk/types/runtime/event-list.ts";

export type ListRunEventsInput = ActionInput<
  never,
  { runId?: string; after?: number; limit?: number },
  never
>;

export async function listRunEvents(input: ListRunEventsInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/run-events";
  return api.get<RuntimeEventList>(path, options);
}
