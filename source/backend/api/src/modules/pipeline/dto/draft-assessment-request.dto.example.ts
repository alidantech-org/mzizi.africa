import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";

/** The contract shape of DraftAssessmentRequest, for generated tests. */
export const draftAssessmentRequestExample: ContractExample = contractExample({
  name: "DraftAssessmentRequest",
  fields: [
    {
      name: "accessBasis",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "approvedScope",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 2 },
    },
    {
      name: "evidence",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 0, maxLength: 5000 },
    },
    {
      name: "rationale",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 0, maxLength: 5000 },
    },
    {
      name: "rightsHolder",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 0, maxLength: 5000 },
    },
    {
      name: "siteId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "sourceType",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
  ],
  invariants: [
  ],
});