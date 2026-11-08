import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { checkSummaryExample } from "#/modules/pipeline/dto/check-summary.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of CheckListResponse, for generated tests. */
export const checkListResponseExample: ContractExample = contractExample({
  name: "CheckListResponse",
  fields: [
    {
      name: "checks",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => checkSummaryExample },
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