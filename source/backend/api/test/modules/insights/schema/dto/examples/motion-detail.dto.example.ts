import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of MotionDetail, for generated tests. */
export const motionDetailExample: ContractExample = contractExample({
  name: "MotionDetail",
  fields: [
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "legal",
      optional: true,
      nullable: true,
      spec: { kind: "unknown" },
    },
    {
      name: "members",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
    {
      name: "motion",
      optional: false,
      nullable: false,
      spec: { kind: "unknown" },
    },
    {
      name: "parties",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
    {
      name: "tally",
      optional: false,
      nullable: false,
      spec: { kind: "unknown" },
    },
  ],
  invariants: [],
});
