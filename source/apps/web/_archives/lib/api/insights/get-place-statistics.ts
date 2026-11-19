import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/_archives/lib/dryv/transport";
import { PlaceOnlyFields } from "#/_archives/lib/types/place-only";
import {
  type PlaceStatistics,
  PlaceStatisticsFields,
} from "#/_archives/lib/types/place-statistics";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getPlaceStatisticsInputFields: Readonly<
  Record<string, readonly FieldMeta[]>
> = {
  input: PlaceOnlyFields,
};
/** Field metadata of the output, when it is a schema. */
export const getPlaceStatisticsOutputFields: readonly FieldMeta[] | undefined =
  PlaceStatisticsFields;
/** This operation has no query plan, so no paging is known. */
export const getPlaceStatisticsPage: PageNames | undefined = undefined;

/** Values for each input port of Get Place Statistics. */
export type GetPlaceStatisticsPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
  featureId?: string;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getPlaceStatisticsRequest(
  ports: GetPlaceStatisticsPorts = {},
): ClientInput {
  return {
    params: {
      featureId: String(ports.featureId),
    },
    query: {
      ...ports.input,
    },
  };
}

/**
 * Population and other statistics of a place, by topic, with history, breakdowns and comparison to its parents.
 *
 * GET /v1/statistics/places/{featureId}. Used when no operation.client pack is bound.
 */
export async function getPlaceStatistics(
  input: ClientInput = {},
): Promise<ClientResponse<PlaceStatistics>> {
  const path = "/v1/statistics/places/{featureId}".replace(
    "{featureId}",
    encodeURIComponent(input.params?.["featureId"] ?? ""),
  );
  return send("GET", path, input);
}
