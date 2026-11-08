import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { contractMilestonePublicExample } from "#/modules/procurement/dto/contract-milestone-public.dto.example.ts";

/** The contract shape of ContractMilestoneResponse, for generated tests. */
export const contractMilestoneResponseExample: ContractExample = contractExample({
  name: "ContractMilestoneResponse",
  fields: [
    {
      name: "milestone",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => contractMilestonePublicExample },
    },
  ],
  invariants: [
  ],
});