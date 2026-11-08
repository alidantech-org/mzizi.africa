import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { runSummaryExample } from "#/modules/pipeline/dto/run-summary.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of RunListResponse, for generated tests. */
export const runListResponseExample: ContractExample = contractExample({
  name: "RunListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "runs",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => runSummaryExample },
    },
  ],
  invariants: [
  ],
});