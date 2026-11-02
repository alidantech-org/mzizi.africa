import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";
import { siteCheckPublicExample } from "#/modules/website/dto/site-check-public.dto.example.ts";

/** The contract shape of SiteChecksListResponse, for generated tests. */
export const siteChecksListResponseExample: ContractExample = contractExample({
  name: "SiteChecksListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "siteChecks",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => siteCheckPublicExample },
    },
  ],
  invariants: [
  ],
});