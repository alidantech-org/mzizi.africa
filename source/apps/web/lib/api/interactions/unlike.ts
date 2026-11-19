import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { type Engagement, EngagementFields } from "#/lib/types/engagement.ts";
import { type LikeInput, LikeInputFields } from "#/lib/types/like-input.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const unlikeInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  body: LikeInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const unlikeOutputFields: readonly FieldMeta[] | undefined = EngagementFields;
/** This operation has no query plan, so no paging is known. */
export const unlikePage: PageNames | undefined = undefined;

/** Values for each input port of Unlike. */
export type UnlikePorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
  body?: LikeInput;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function unlikeRequest(ports: UnlikePorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...ports.input,
    },
    body: ports.body,
  };
}

/**
 * This device withdraws its like.
 *
 * POST /v1/likes/remove. Used when no operation.client pack is bound.
 */
export async function unlike(input: ClientInput = {}): Promise<ClientResponse<Engagement>> {
  const path = "/v1/likes/remove";
  return send("POST", path, input);
}
