import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/_archives/lib/dryv/transport";
import {
  type FeatureDetail,
  FeatureDetailFields,
} from "#/_archives/lib/types/feature-detail";
import { FeatureKeyFields } from "#/_archives/lib/types/feature-key";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getFeatureInputFields: Readonly<
  Record<string, readonly FieldMeta[]>
> = {
  input: FeatureKeyFields,
};
/** Field metadata of the output, when it is a schema. */
export const getFeatureOutputFields: readonly FieldMeta[] | undefined =
  FeatureDetailFields;
/** This operation is not paged. */
export const getFeaturePage: PageNames | undefined = undefined;

/** Values for each input port of Get Feature. */
export type GetFeaturePorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
  featureId?: string;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getFeatureRequest(ports: GetFeaturePorts = {}): ClientInput {
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
 * One geographic feature with its names.
 *
 * GET /v1/geography/features/{featureId}. Used when no operation.client pack is bound.
 */
export async function getFeature(
  input: ClientInput = {},
): Promise<ClientResponse<FeatureDetail>> {
  const path = "/v1/geography/features/{featureId}".replace(
    "{featureId}",
    encodeURIComponent(input.params?.["featureId"] ?? ""),
  );
  return send("GET", path, input);
}
