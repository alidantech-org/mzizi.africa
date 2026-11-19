import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/_archives/lib/dryv/transport";
import {
  type Engagement,
  EngagementFields,
} from "#/_archives/lib/types/engagement";
import {
  type LikeInput,
  LikeInputFields,
} from "#/_archives/lib/types/like-input";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const likeInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  body: LikeInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const likeOutputFields: readonly FieldMeta[] | undefined =
  EngagementFields;
/** This operation has no query plan, so no paging is known. */
export const likePage: PageNames | undefined = undefined;

/** Values for each input port of Like. */
export type LikePorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
  body?: LikeInput;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function likeRequest(ports: LikePorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...ports.input,
    },
    body: ports.body,
  };
}

/**
 * This device likes a subject; liking twice changes nothing.
 *
 * POST /v1/likes. Used when no operation.client pack is bound.
 */
export async function like(
  input: ClientInput = {},
): Promise<ClientResponse<Engagement>> {
  const path = "/v1/likes";
  return send("POST", path, input);
}
