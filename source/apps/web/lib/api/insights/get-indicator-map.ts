import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { type IndicatorMap, IndicatorMapFields } from "#/lib/types/indicator-map.ts";
import { MapInputFields } from "#/lib/types/map-input.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getIndicatorMapInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  input: MapInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const getIndicatorMapOutputFields: readonly FieldMeta[] | undefined = IndicatorMapFields;
/** This operation has no query plan, so no paging is known. */
export const getIndicatorMapPage: PageNames | undefined = undefined;

/** Values for each input port of Get Indicator Map. */
export type GetIndicatorMapPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
  indicatorCode?: string;
  parentFeatureId?: string;
  kindCode?: string;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getIndicatorMapRequest(ports: GetIndicatorMapPorts = {}): ClientInput {
  return {
    params: {
      indicatorCode: String(ports.indicatorCode),
    },
    query: {
      ...ports.input,
      parentFeatureId: ports.parentFeatureId,
      kindCode: ports.kindCode,
    },
  };
}

/**
 * One indicator's latest value for each unit under a parent, for a heat map.
 *
 * GET /v1/statistics/indicators/{indicatorCode}/map. Used when no operation.client pack is bound.
 */
export async function getIndicatorMap(
  input: ClientInput = {},
): Promise<ClientResponse<IndicatorMap>> {
  const path = "/v1/statistics/indicators/{indicatorCode}/map".replace(
    "{indicatorCode}",
    encodeURIComponent(input.params?.["indicatorCode"] ?? ""),
  );
  return send("GET", path, input);
}
