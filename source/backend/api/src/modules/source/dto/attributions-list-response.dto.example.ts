import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";
import { attributionPublicExample } from "#/modules/source/dto/attribution-public.dto.example.ts";

/** The contract shape of AttributionsListResponse, for generated tests. */
export const attributionsListResponseExample: ContractExample = contractExample({
  name: "AttributionsListResponse",
  fields: [
    {
      name: "attributions",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => attributionPublicExample },
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