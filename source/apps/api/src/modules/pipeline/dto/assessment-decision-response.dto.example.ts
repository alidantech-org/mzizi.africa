import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";

/** The contract shape of AssessmentDecisionResponse, for generated tests. */
export const assessmentDecisionResponseExample: ContractExample = contractExample({
  name: "AssessmentDecisionResponse",
  fields: [
    {
      name: "assessmentId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "newAssessmentId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "outcome",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
  ],
  invariants: [
  ],
});