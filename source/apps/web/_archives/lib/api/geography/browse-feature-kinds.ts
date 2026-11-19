import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/_archives/lib/dryv/transport";
import {
  type FeatureKindCollection,
  FeatureKindCollectionFields,
} from "#/_archives/lib/types/feature-kind-collection";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const browseFeatureKindsInputFields: Readonly<
  Record<string, readonly FieldMeta[]>
> = {};
/** Field metadata of the output, when it is a schema. */
export const browseFeatureKindsOutputFields: readonly FieldMeta[] | undefined =
  FeatureKindCollectionFields;
/** This operation has no query plan, so no paging is known. */
export const browseFeatureKindsPage: PageNames | undefined = undefined;

/** Values for each input port of Browse Feature Kinds. */
export type BrowseFeatureKindsPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function browseFeatureKindsRequest(
  ports: BrowseFeatureKindsPorts = {},
): ClientInput {
  return {
    params: {},
    query: {
      ...ports.input,
    },
  };
}

/**
 * The kinds a geographic feature can have, in code order, for choosing a feature type.
 *
 * GET /v1/geography/feature-kinds. Used when no operation.client pack is bound.
 */
export async function browseFeatureKinds(
  input: ClientInput = {},
): Promise<ClientResponse<FeatureKindCollection>> {
  const path = "/v1/geography/feature-kinds";
  return send("GET", path, input);
}
