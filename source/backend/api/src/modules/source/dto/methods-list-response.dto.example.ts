import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";
import { methodPublicExample } from "#/modules/source/dto/method-public.dto.example.ts";

/** The contract shape of MethodsListResponse, for generated tests. */
export const methodsListResponseExample: ContractExample = contractExample({
  name: "MethodsListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "methods",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => methodPublicExample },
    },
  ],
  invariants: [
  ],
});