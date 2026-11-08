import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";
import { siteFamilyPublicExample } from "#/modules/website/dto/site-family-public.dto.example.ts";

/** The contract shape of SiteFamiliesListResponse, for generated tests. */
export const siteFamiliesListResponseExample: ContractExample = contractExample({
  name: "SiteFamiliesListResponse",
  fields: [
    {
      name: "families",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => siteFamilyPublicExample },
    },
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
  ],
  invariants: [
  ],
});