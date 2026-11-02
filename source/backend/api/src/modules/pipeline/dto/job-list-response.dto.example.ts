import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { jobSummaryExample } from "#/modules/pipeline/dto/job-summary.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of JobListResponse, for generated tests. */
export const jobListResponseExample: ContractExample = contractExample({
  name: "JobListResponse",
  fields: [
    {
      name: "jobs",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => jobSummaryExample },
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