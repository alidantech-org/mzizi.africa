import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import {
  type LeaderboardMetricList,
  LeaderboardMetricListFields,
} from "#/lib/types/leaderboard-metric-list.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const listLeaderboardMetricsInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {};
/** Field metadata of the output, when it is a schema. */
export const listLeaderboardMetricsOutputFields: readonly FieldMeta[] | undefined =
  LeaderboardMetricListFields;
/** This operation has no query plan, so no paging is known. */
export const listLeaderboardMetricsPage: PageNames | undefined = undefined;

/** Values for each input port of List Leaderboard Metrics. */
export type ListLeaderboardMetricsPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function listLeaderboardMetricsRequest(
  ports: ListLeaderboardMetricsPorts = {},
): ClientInput {
  return {
    params: {},
    query: {
      ...ports.input,
    },
  };
}

/**
 * What places can be ranked by: statistics, finance, civic delivery, procurement and elections.
 *
 * GET /v1/leaderboards. Used when no operation.client pack is bound.
 */
export async function listLeaderboardMetrics(
  input: ClientInput = {},
): Promise<ClientResponse<LeaderboardMetricList>> {
  const path = "/v1/leaderboards";
  return send("GET", path, input);
}
