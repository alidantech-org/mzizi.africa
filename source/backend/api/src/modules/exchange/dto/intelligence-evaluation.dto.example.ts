import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { EvaluationKind } from "#/types/exchange/evaluation-kind.enum.ts";

/** The contract shape of IntelligenceEvaluation, for generated tests. */
export const intelligenceEvaluationExample: ContractExample = contractExample({
  name: "IntelligenceEvaluation",
  fields: [
    {
      name: "confidence",
      optional: true,
      nullable: false,
      spec: { kind: "number", min: 0, max: 1 },
    },
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "explanation",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 1 },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "inputHash",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 64, maxLength: 64 },
    },
    {
      name: "kind",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(EvaluationKind) },
    },
    {
      name: "model",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "output",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 2 },
    },
    {
      name: "subjectCandidateId",
      optional: true,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "subjectResultId",
      optional: true,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "tool",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "toolVersion",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 40 },
    },
  ],
  invariants: [
  ],
});