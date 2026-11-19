import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/_archives/lib/dryv/transport";
import {
  type EngagementInput,
  EngagementInputFields,
} from "#/_archives/lib/types/engagement-input";
import {
  type Engagement,
  EngagementFields,
} from "#/_archives/lib/types/engagement";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getEngagementInputFields: Readonly<
  Record<string, readonly FieldMeta[]>
> = {
  input: EngagementInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const getEngagementOutputFields: readonly FieldMeta[] | undefined =
  EngagementFields;
/** This operation has no query plan, so no paging is known. */
export const getEngagementPage: PageNames | undefined = undefined;

/** Values for each input port of Get Engagement. */
export type GetEngagementPorts = {
  input?: EngagementInput;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getEngagementRequest(
  ports: GetEngagementPorts = {},
): ClientInput {
  return {
    params: {},
    query: {
      ...(ports.input as Record<string, unknown> | undefined),
    },
  };
}

/**
 * How many likes a subject has, and whether this device has liked it. Views are counted and not returned.
 *
 * GET /v1/engagement. Used when no operation.client pack is bound.
 */
export async function getEngagement(
  input: ClientInput = {},
): Promise<ClientResponse<Engagement>> {
  const path = "/v1/engagement";
  return send("GET", path, input);
}
