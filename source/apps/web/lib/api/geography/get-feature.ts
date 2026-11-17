import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  send,
} from "#/lib/dryv/transport.ts";
import { type FeatureDetail, FeatureDetailFields } from "#/lib/types/feature-detail.ts";
import { FeatureKeyFields } from "#/lib/types/feature-key.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getFeatureInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  input: FeatureKeyFields,
};
/** Field metadata of the output, when it is a schema. */
export const getFeatureOutputFields: readonly FieldMeta[] | undefined = FeatureDetailFields;
/** This operation is not paged. */
export const getFeaturePage = undefined;

/** Values for each input port of Get Feature. */
export type GetFeaturePorts = {
  featureId?: string;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getFeatureRequest(ports: GetFeaturePorts = {}): ClientInput {
  return {
    params: {
      featureId: String(ports.featureId),
    },
    query: {},
  };
}

/**
 * One geographic feature with its names.
 *
 * GET /v1/geography/features/{featureId}. Used when no operation.client pack is bound.
 */
export async function getFeature(input: ClientInput = {}): Promise<ClientResponse<FeatureDetail>> {
  const path = "/v1/geography/features/{featureId}".replace(
    "{featureId}",
    encodeURIComponent(input.params?.["featureId"] ?? ""),
  );
  return send("GET", path, input);
}
