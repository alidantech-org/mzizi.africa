import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { assessmentSummaryExample } from "#/modules/pipeline/dto/assessment-summary.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of AssessmentListResponse, for generated tests. */
export const assessmentListResponseExample: ContractExample = contractExample({
  name: "AssessmentListResponse",
  fields: [
    {
      name: "assessments",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => assessmentSummaryExample },
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