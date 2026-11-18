import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { type IndicatorSeries, IndicatorSeriesFields } from "#/lib/types/indicator-series.ts";
import { SeriesInputFields } from "#/lib/types/series-input.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getIndicatorSeriesInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  input: SeriesInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const getIndicatorSeriesOutputFields: readonly FieldMeta[] | undefined =
  IndicatorSeriesFields;
/** This operation has no query plan, so no paging is known. */
export const getIndicatorSeriesPage: PageNames | undefined = undefined;

/** Values for each input port of Get Indicator Series. */
export type GetIndicatorSeriesPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
  indicatorCode?: string;
  featureId?: string;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getIndicatorSeriesRequest(ports: GetIndicatorSeriesPorts = {}): ClientInput {
  return {
    params: {
      indicatorCode: String(ports.indicatorCode),
    },
    query: {
      ...ports.input,
      featureId: ports.featureId,
    },
  };
}

/**
 * One indicator over time for one place, optionally broken down.
 *
 * GET /v1/statistics/indicators/{indicatorCode}/series. Used when no operation.client pack is bound.
 */
export async function getIndicatorSeries(
  input: ClientInput = {},
): Promise<ClientResponse<IndicatorSeries>> {
  const path = "/v1/statistics/indicators/{indicatorCode}/series".replace(
    "{indicatorCode}",
    encodeURIComponent(input.params?.["indicatorCode"] ?? ""),
  );
  return send("GET", path, input);
}
