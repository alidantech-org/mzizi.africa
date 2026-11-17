import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { CitationInputFields } from "#/lib/types/citation-input.ts";
import { type EvidenceDetail, EvidenceDetailFields } from "#/lib/types/evidence-detail.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getEvidenceInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  input: CitationInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const getEvidenceOutputFields: readonly FieldMeta[] | undefined = EvidenceDetailFields;
/** This operation has no query plan, so no paging is known. */
export const getEvidencePage: PageNames | undefined = undefined;

/** Values for each input port of Get Evidence. */
export type GetEvidencePorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
  citationId?: string;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getEvidenceRequest(ports: GetEvidencePorts = {}): ClientInput {
  return {
    params: {
      citationId: String(ports.citationId),
    },
    query: {
      ...ports.input,
    },
  };
}

/**
 * One citation with its source, edition, quoted text and the files it points at.
 *
 * GET /v1/evidence/{citationId}. Used when no operation.client pack is bound.
 */
export async function getEvidence(
  input: ClientInput = {},
): Promise<ClientResponse<EvidenceDetail>> {
  const path = "/v1/evidence/{citationId}".replace(
    "{citationId}",
    encodeURIComponent(input.params?.["citationId"] ?? ""),
  );
  return send("GET", path, input);
}
