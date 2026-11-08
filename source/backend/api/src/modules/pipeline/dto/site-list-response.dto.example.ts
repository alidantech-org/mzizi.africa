import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { siteSummaryExample } from "#/modules/pipeline/dto/site-summary.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of SiteListResponse, for generated tests. */
export const siteListResponseExample: ContractExample = contractExample({
  name: "SiteListResponse",
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
      spec: { kind: "schema", example: () => siteSummaryExample },
    },
  ],
  invariants: [
  ],
});