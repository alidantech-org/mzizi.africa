import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { personHandlePublicExample } from "#/modules/person/dto/person-handle-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of PersonHandlesListResponse, for generated tests. */
export const personHandlesListResponseExample: ContractExample = contractExample({
  name: "PersonHandlesListResponse",
  fields: [
    {
      name: "handles",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => personHandlePublicExample },
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