import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { type ElectionDetail, ElectionDetailFields } from "#/lib/types/election-detail.ts";
import { ElectionInputFields } from "#/lib/types/election-input.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getElectionInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  input: ElectionInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const getElectionOutputFields: readonly FieldMeta[] | undefined = ElectionDetailFields;
/** This operation has no query plan, so no paging is known. */
export const getElectionPage: PageNames | undefined = undefined;

/** Values for each input port of Get Election. */
export type GetElectionPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
  electionId?: string;
  parentFeatureId?: string;
  contestKind?: string;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getElectionRequest(ports: GetElectionPorts = {}): ClientInput {
  return {
    params: {
      electionId: String(ports.electionId),
    },
    query: {
      ...ports.input,
      parentFeatureId: ports.parentFeatureId,
      contestKind: ports.contestKind,
    },
  };
}

/**
 * One election: its contests, and results by unit under a parent, for tables and heat maps.
 *
 * GET /v1/elections/{electionId}. Used when no operation.client pack is bound.
 */
export async function getElection(
  input: ClientInput = {},
): Promise<ClientResponse<ElectionDetail>> {
  const path = "/v1/elections/{electionId}".replace(
    "{electionId}",
    encodeURIComponent(input.params?.["electionId"] ?? ""),
  );
  return send("GET", path, input);
}
