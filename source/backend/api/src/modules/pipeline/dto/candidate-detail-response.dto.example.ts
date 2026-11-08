import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { candidateIssueExample } from "#/modules/pipeline/dto/candidate-issue.dto.example.ts";
import { candidateSummaryExample } from "#/modules/pipeline/dto/candidate-summary.dto.example.ts";

/** The contract shape of CandidateDetailResponse, for generated tests. */
export const candidateDetailResponseExample: ContractExample = contractExample({
  name: "CandidateDetailResponse",
  fields: [
    {
      name: "candidate",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => candidateSummaryExample },
    },
    {
      name: "captureId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "current",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 2 },
    },
    {
      name: "documentId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "extractionResultId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "issues",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => candidateIssueExample },
    },
    {
      name: "locator",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 2 },
    },
    {
      name: "payload",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 2 },
    },
    {
      name: "segmentKey",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "siteId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [
  ],
});