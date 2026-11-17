import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  send,
} from "#/lib/dryv/transport.ts";
import { type FeatureCollection, FeatureCollectionFields } from "#/lib/types/feature-collection.ts";
import { type FeatureWindow, FeatureWindowFields } from "#/lib/types/feature-window.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const browseFeaturesInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  input: FeatureWindowFields,
};
/** Field metadata of the output, when it is a schema. */
export const browseFeaturesOutputFields: readonly FieldMeta[] | undefined = FeatureCollectionFields;

/** Values for each input port of Browse Features. */
export type BrowseFeaturesPorts = {
  input?: FeatureWindow;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function browseFeaturesRequest(ports: BrowseFeaturesPorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...(ports.input as Record<string, unknown> | undefined),
    },
  };
}

/**
 * Browse geographic features with their names, optionally of one type or by code prefix.
 *
 * GET /v1/geography/features. Used when no operation.client pack is bound.
 */
export async function browseFeatures(
  input: ClientInput = {},
): Promise<ClientResponse<FeatureCollection>> {
  const path = "/v1/geography/features";
  return send("GET", path, input);
}
