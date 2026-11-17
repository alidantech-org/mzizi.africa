import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { SeedCatalogQueryFields } from "#/lib/types/seed-catalog-query.ts";
import { type SeedCatalog, SeedCatalogFields } from "#/lib/types/seed-catalog.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getSeedCatalogInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  input: SeedCatalogQueryFields,
};
/** Field metadata of the output, when it is a schema. */
export const getSeedCatalogOutputFields: readonly FieldMeta[] | undefined = SeedCatalogFields;
/** This operation has no query plan, so no paging is known. */
export const getSeedCatalogPage: PageNames | undefined = undefined;

/** Values for each input port of Get Seed Catalog. */
export type GetSeedCatalogPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
  table?: string;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getSeedCatalogRequest(ports: GetSeedCatalogPorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...ports.input,
      table: ports.table,
    },
  };
}

/**
 * Read the generated seed contract catalog, optionally filtered by table.
 *
 * GET /v1/catalog/seed-tables. Used when no operation.client pack is bound.
 */
export async function getSeedCatalog(
  input: ClientInput = {},
): Promise<ClientResponse<SeedCatalog>> {
  const path = "/v1/catalog/seed-tables";
  return send("GET", path, input);
}
