import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { VerificationOutcome } from "#/modules/source/enum/verification-outcome.enum.ts";

/** The contract shape of Verifications, for generated tests. */
export const verificationsExample: ContractExample = contractExample({
  name: "Verifications",
  fields: [
    {
      name: "assessedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "confidence",
      optional: true,
      nullable: true,
      spec: { kind: "number", min: 0, max: 1 },
    },
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "deletedAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "evidenceId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "explanation",
      optional: false,
      nullable: false,
      spec: { kind: "string", maxLength: 4000 },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "methodId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "outcome",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(VerificationOutcome) },
    },
    {
      name: "reviewerSnapshot",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "json" },
    },
    {
      name: "supersedesId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "updatedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "version",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 1 },
    },
  ],
  invariants: [
  ],
});