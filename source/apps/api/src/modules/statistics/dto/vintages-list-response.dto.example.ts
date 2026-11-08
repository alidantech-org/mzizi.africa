import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";
import { vintagePublicExample } from "#/modules/statistics/dto/vintage-public.dto.example.ts";

/** The contract shape of VintagesListResponse, for generated tests. */
export const vintagesListResponseExample: ContractExample = contractExample({
  name: "VintagesListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "vintages",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => vintagePublicExample },
    },
  ],
  invariants: [
  ],
});