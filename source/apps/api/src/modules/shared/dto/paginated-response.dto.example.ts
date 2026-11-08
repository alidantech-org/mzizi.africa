import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of PaginatedResponse, for generated tests. */
export const paginatedResponseExample: ContractExample = contractExample({
  name: "PaginatedResponse",
  fields: [
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