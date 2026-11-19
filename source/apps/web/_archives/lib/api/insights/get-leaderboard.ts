import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/_archives/lib/dryv/transport";
import { BoardInputFields } from "#/_archives/lib/types/board-input";
import {
  type Leaderboard,
  LeaderboardFields,
} from "#/_archives/lib/types/leaderboard";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getLeaderboardInputFields: Readonly<
  Record<string, readonly FieldMeta[]>
> = {
  input: BoardInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const getLeaderboardOutputFields: readonly FieldMeta[] | undefined =
  LeaderboardFields;
/** This operation has no query plan, so no paging is known. */
export const getLeaderboardPage: PageNames | undefined = undefined;

/** Values for each input port of Get Leaderboard. */
export type GetLeaderboardPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
  metricCode?: string;
  kindCode?: string;
  parentFeatureId?: string;
  limit?: number;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getLeaderboardRequest(
  ports: GetLeaderboardPorts = {},
): ClientInput {
  return {
    params: {
      metricCode: String(ports.metricCode),
    },
    query: {
      ...ports.input,
      kindCode: ports.kindCode,
      parentFeatureId: ports.parentFeatureId,
      limit: ports.limit,
    },
  };
}

/**
 * Places (or leaders, parties) ranked by one metric, within a parent area and a level.
 *
 * GET /v1/leaderboards/{metricCode}. Used when no operation.client pack is bound.
 */
export async function getLeaderboard(
  input: ClientInput = {},
): Promise<ClientResponse<Leaderboard>> {
  const path = "/v1/leaderboards/{metricCode}".replace(
    "{metricCode}",
    encodeURIComponent(input.params?.["metricCode"] ?? ""),
  );
  return send("GET", path, input);
}
