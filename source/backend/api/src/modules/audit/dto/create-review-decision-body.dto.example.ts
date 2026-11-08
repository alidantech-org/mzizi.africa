import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { Decision } from "#/types/audit/decision.enum.ts";
import { VerificationState } from "#/types/shared/verification-state.enum.ts";

/** The contract shape of CreateReviewDecisionBody, for generated tests. */
export const createReviewDecisionBodyExample: ContractExample = contractExample({
  name: "CreateReviewDecisionBody",
  fields: [
    {
      name: "decision",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(Decision) },
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
  ],
  invariants: [
  ],
});