import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { type LanguageList, LanguageListFields } from "#/lib/types/language-list.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const listLanguagesInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {};
/** Field metadata of the output, when it is a schema. */
export const listLanguagesOutputFields: readonly FieldMeta[] | undefined = LanguageListFields;
/** This operation has no query plan, so no paging is known. */
export const listLanguagesPage: PageNames | undefined = undefined;

/** Values for each input port of List Languages. */
export type ListLanguagesPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function listLanguagesRequest(ports: ListLanguagesPorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...ports.input,
    },
  };
}

/**
 * The languages the system can serve names and labels in, for a language picker.
 *
 * GET /v1/languages. Used when no operation.client pack is bound.
 */
export async function listLanguages(
  input: ClientInput = {},
): Promise<ClientResponse<LanguageList>> {
  const path = "/v1/languages";
  return send("GET", path, input);
}
