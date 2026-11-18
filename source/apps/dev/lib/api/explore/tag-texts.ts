import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { type TagBody, TagBodyFields } from "#/lib/types/tag-body.ts";
import { type TaggedList, TaggedListFields } from "#/lib/types/tagged-list.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const tagTextsInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  body: TagBodyFields,
};
/** Field metadata of the output, when it is a schema. */
export const tagTextsOutputFields: readonly FieldMeta[] | undefined = TaggedListFields;
/** This operation has no query plan, so no paging is known. */
export const tagTextsPage: PageNames | undefined = undefined;

/** Values for each input port of Tag Texts. */
export type TagTextsPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
  body?: TagBody;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function tagTextsRequest(ports: TagTextsPorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...ports.input,
    },
    body: ports.body,
  };
}

/**
 * Tag each text with the term groups it mentions.
 *
 * POST /v1/explore/terms/tag. Used when no operation.client pack is bound.
 */
export async function tagTexts(input: ClientInput = {}): Promise<ClientResponse<TaggedList>> {
  const path = "/v1/explore/terms/tag";
  return send("POST", path, input);
}
