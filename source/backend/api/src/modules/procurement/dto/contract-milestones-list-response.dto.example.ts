import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { contractMilestonePublicExample } from "#/modules/procurement/dto/contract-milestone-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of ContractMilestonesListResponse, for generated tests. */
export const contractMilestonesListResponseExample: ContractExample = contractExample({
  name: "ContractMilestonesListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "milestones",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => contractMilestonePublicExample },
    },
  ],
  invariants: [
  ],
});