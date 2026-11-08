import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { reviewDecisionPublicExample } from "#/modules/audit/dto/review-decision-public.dto.example.ts";

/** The contract shape of ReviewDecisionResponse, for generated tests. */
export const reviewDecisionResponseExample: ContractExample = contractExample({
  name: "ReviewDecisionResponse",
  fields: [
    {
      name: "decision",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => reviewDecisionPublicExample },
    },
  ],
  invariants: [
  ],
});