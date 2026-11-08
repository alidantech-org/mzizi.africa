import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { VerificationState } from "#/types/shared/verification-state.enum.ts";

/** The contract shape of VerificationPublic, for generated tests. */
export const verificationPublicExample: ContractExample = contractExample({
  name: "VerificationPublic",
  fields: [
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "decidedBy",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "decisionId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
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
      spec: { kind: "string", minLength: 1 },
    },
    {
      name: "state",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(VerificationState) },
    },
    {
      name: "targetId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "targetKind",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 2, maxLength: 100 },
    },
    {
      name: "updatedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "version",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
    },
  ],
  invariants: [
  ],
});