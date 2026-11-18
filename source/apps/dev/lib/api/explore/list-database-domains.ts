import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { type DomainList, DomainListFields } from "#/lib/types/domain-list.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const listDatabaseDomainsInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {};
/** Field metadata of the output, when it is a schema. */
export const listDatabaseDomainsOutputFields: readonly FieldMeta[] | undefined = DomainListFields;
/** This operation has no query plan, so no paging is known. */
export const listDatabaseDomainsPage: PageNames | undefined = undefined;

/** Values for each input port of List Database Domains. */
export type ListDatabaseDomainsPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function listDatabaseDomainsRequest(ports: ListDatabaseDomainsPorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...ports.input,
    },
  };
}

/**
 * Every schema with its tables and row counts.
 *
 * GET /v1/explore/db/domains. Used when no operation.client pack is bound.
 */
export async function listDatabaseDomains(
  input: ClientInput = {},
): Promise<ClientResponse<DomainList>> {
  const path = "/v1/explore/db/domains";
  return send("GET", path, input);
}
