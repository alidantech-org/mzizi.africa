import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { captureSummaryExample } from "#/modules/pipeline/dto/capture-summary.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of CaptureListResponse, for generated tests. */
export const captureListResponseExample: ContractExample = contractExample({
  name: "CaptureListResponse",
  fields: [
    {
      name: "captures",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => captureSummaryExample },
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