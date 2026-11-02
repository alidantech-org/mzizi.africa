import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";

/** The contract shape of DossierSummary, for generated tests. */
export const dossierSummaryExample: ContractExample = contractExample({
  name: "DossierSummary",
  fields: [
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "isCurrent",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "jurisdictionId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "jurisdictionName",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "launchStage",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "openQuestions",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 0, maxLength: 5000 },
    },
    {
      name: "reviewedAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date-time" },
    },
  ],
  invariants: [
  ],
});