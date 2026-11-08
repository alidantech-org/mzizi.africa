import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { bidPublicExample } from "#/modules/procurement/dto/bid-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of BidsListResponse, for generated tests. */
export const bidsListResponseExample: ContractExample = contractExample({
  name: "BidsListResponse",
  fields: [
    {
      name: "bids",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => bidPublicExample },
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