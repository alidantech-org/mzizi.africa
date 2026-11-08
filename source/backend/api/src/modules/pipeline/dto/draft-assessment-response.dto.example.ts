import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";

/** The contract shape of DraftAssessmentResponse, for generated tests. */
export const draftAssessmentResponseExample: ContractExample = contractExample({
  name: "DraftAssessmentResponse",
  fields: [
    {
      name: "assessmentId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [
  ],
});