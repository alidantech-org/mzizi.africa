import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/_archives/lib/dryv/transport";
import {
  type CountryContextDocument,
  CountryContextDocumentFields,
} from "#/_archives/lib/types/country-context-document";
import {
  type StructureInput,
  StructureInputFields,
} from "#/_archives/lib/types/structure-input";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getCountryContextInputFields: Readonly<
  Record<string, readonly FieldMeta[]>
> = {
  input: StructureInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const getCountryContextOutputFields: readonly FieldMeta[] | undefined =
  CountryContextDocumentFields;
/** This operation is not paged. */
export const getCountryContextPage: PageNames | undefined = undefined;

/** Values for each input port of Get Country Context. */
export type GetCountryContextPorts = {
  input?: StructureInput;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getCountryContextRequest(
  ports: GetCountryContextPorts = {},
): ClientInput {
  return {
    params: {},
    query: {
      ...(ports.input as Record<string, unknown> | undefined),
    },
  };
}

/**
 * Explicit country identity and recorded routing roots; no default-country inference.
 *
 * GET /v1/structure/context. Used when no operation.client pack is bound.
 */
export async function getCountryContext(
  input: ClientInput = {},
): Promise<ClientResponse<CountryContextDocument>> {
  const path = "/v1/structure/context";
  return send("GET", path, input);
}
