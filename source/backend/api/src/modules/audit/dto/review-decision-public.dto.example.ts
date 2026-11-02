import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { Decision } from "#/types/audit/decision.enum.ts";
import { VerificationState } from "#/types/shared/verification-state.enum.ts";

/** The contract shape of ReviewDecisionPublic, for generated tests. */
export const reviewDecisionPublicExample: ContractExample = contractExample({
  name: "ReviewDecisionPublic",
  fields: [
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "decision",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(Decision) },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "proposedState",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(VerificationState) },
    },
    {
      name: "rationale",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1 },
    },
    {
      name: "reviewerId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
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