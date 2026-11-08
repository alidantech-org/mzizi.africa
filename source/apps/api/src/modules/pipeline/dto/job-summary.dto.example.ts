import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";

/** The contract shape of JobSummary, for generated tests. */
export const jobSummaryExample: ContractExample = contractExample({
  name: "JobSummary",
  fields: [
    {
      name: "attempts",
      optional: false,
      nullable: false,
      spec: { kind: "number", min: 0, max: 1000 },
    },
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "error",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 0, maxLength: 5000 },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "kind",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "status",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
  ],
  invariants: [
  ],
});