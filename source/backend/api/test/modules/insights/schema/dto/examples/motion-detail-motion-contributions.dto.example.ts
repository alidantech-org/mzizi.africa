import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of MotionDetailMotionContributions, for generated tests. */
export const motionDetailMotionContributionsExample: ContractExample = contractExample({
  name: "MotionDetailMotionContributions",
  fields: [
    {
      name: "holderId",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "kind",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "party",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "summary",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "wordCount",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
  ],
  invariants: [],
});
