import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { CandidateStatus } from "#/types/exchange/candidate-status.enum.ts";
import { ProvenanceMethod } from "#/types/shared/provenance-method.enum.ts";

/** The contract shape of CandidateRecord, for generated tests. */
export const candidateRecordExample: ContractExample = contractExample({
  name: "CandidateRecord",
  fields: [
    {
      name: "confidence",
      optional: true,
      nullable: false,
      spec: { kind: "number", min: 0, max: 1 },
    },
    {
      name: "extractionResultId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "locator",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 2 },
    },
    {
      name: "method",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(ProvenanceMethod) },
    },
    {
      name: "naturalKeyHash",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 64, maxLength: 64 },
    },
    {
      name: "payload",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 2 },
    },
    {
      name: "resolvedTargetId",
      optional: true,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "runId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "segmentKey",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "status",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(CandidateStatus) },
    },
    {
      name: "supersedesCandidateId",
      optional: true,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "target",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 3, maxLength: 100 },
    },
  ],
  invariants: [
  ],
});