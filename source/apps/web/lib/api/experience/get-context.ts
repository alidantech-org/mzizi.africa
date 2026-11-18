import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { ContextInputFields } from "#/lib/types/context-input.ts";
import { type Context, ContextFields } from "#/lib/types/context.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getContextInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  input: ContextInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const getContextOutputFields: readonly FieldMeta[] | undefined = ContextFields;
/** This operation has no query plan, so no paging is known. */
export const getContextPage: PageNames | undefined = undefined;

/** Values for each input port of Get Context. */
export type GetContextPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
  countryCode?: string;
  languageCode?: string;
  path?: string;
  featureId?: string;
  edgeCountry?: string;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getContextRequest(ports: GetContextPorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...ports.input,
      countryCode: ports.countryCode,
      languageCode: ports.languageCode,
      path: ports.path,
      featureId: ports.featureId,
    },
  };
}

/**
 * Who and where the visitor is: the country and how it was decided, the language, the place resolved from the clean address path, the levels of the country's ladder and the countries that can be chosen.
 *
 * GET /v1/context. Used when no operation.client pack is bound.
 */
export async function getContext(input: ClientInput = {}): Promise<ClientResponse<Context>> {
  const path = "/v1/context";
  return send("GET", path, input);
}
