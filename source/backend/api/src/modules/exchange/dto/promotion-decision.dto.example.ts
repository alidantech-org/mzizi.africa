import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { PromotionOutcome } from "#/types/exchange/promotion-outcome.enum.ts";
import { VerificationState } from "#/types/shared/verification-state.enum.ts";

/** The contract shape of PromotionDecision, for generated tests. */
export const promotionDecisionExample: ContractExample = contractExample({
  name: "PromotionDecision",
  fields: [
    {
      name: "auditDecisionId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "candidateId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "decidedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "outcome",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(PromotionOutcome) },
    },
    {
      name: "previousTargetId",
      optional: true,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "reasons",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "target",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 3, maxLength: 100 },
    },
    {
      name: "targetId",
      optional: true,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "verificationState",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(VerificationState) },
    },
  ],
  invariants: [
  ],
});