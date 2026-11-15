import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { paginationMetaExample } from "@test/modules/shared/schema/dto/examples/pagination-meta.dto.example.ts";

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
  invariants: [],
});
