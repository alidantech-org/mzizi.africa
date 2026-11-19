import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/_archives/lib/dryv/transport";
import {
  type FeatureGeometryCollection,
  FeatureGeometryCollectionFields,
} from "#/_archives/lib/types/feature-geometry-collection";
import { FeatureKeyFields } from "#/_archives/lib/types/feature-key";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const listFeatureGeometriesInputFields: Readonly<
  Record<string, readonly FieldMeta[]>
> = {
  input: FeatureKeyFields,
};
/** Field metadata of the output, when it is a schema. */
export const listFeatureGeometriesOutputFields:
  | readonly FieldMeta[]
  | undefined = FeatureGeometryCollectionFields;
/** This operation has no query plan, so no paging is known. */
export const listFeatureGeometriesPage: PageNames | undefined = undefined;

/** Values for each input port of List Feature Geometries. */
export type ListFeatureGeometriesPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
  featureId?: string;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function listFeatureGeometriesRequest(
  ports: ListFeatureGeometriesPorts = {},
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
 * The current drawings of one feature, each with its role, basis, revision, confidence, zoom range and validity. A feature with no drawing returns an empty list.
 *
 * GET /v1/geography/features/{featureId}/geometries. Used when no operation.client pack is bound.
 */
export async function listFeatureGeometries(
  input: ClientInput = {},
): Promise<ClientResponse<FeatureGeometryCollection>> {
  const path = "/v1/geography/features/{featureId}/geometries".replace(
    "{featureId}",
    encodeURIComponent(input.params?.["featureId"] ?? ""),
  );
  return send("GET", path, input);
}
