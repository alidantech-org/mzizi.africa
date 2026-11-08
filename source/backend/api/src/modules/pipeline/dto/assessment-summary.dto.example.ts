import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";

/** The contract shape of AssessmentSummary, for generated tests. */
export const assessmentSummaryExample: ContractExample = contractExample({
  name: "AssessmentSummary",
  fields: [
    {
      name: "approvedScope",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 2 },
    },
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
      name: "rationale",
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
    {
      name: "reviewedBy",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "rightsHolder",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "siteId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "siteName",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "sourceType",
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