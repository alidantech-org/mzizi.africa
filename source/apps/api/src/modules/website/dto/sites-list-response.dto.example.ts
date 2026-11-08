import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";
import { sitePublicExample } from "#/modules/website/dto/site-public.dto.example.ts";

/** The contract shape of SitesListResponse, for generated tests. */
export const sitesListResponseExample: ContractExample = contractExample({
  name: "SitesListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "sites",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => sitePublicExample },
    },
  ],
  invariants: [
  ],
});