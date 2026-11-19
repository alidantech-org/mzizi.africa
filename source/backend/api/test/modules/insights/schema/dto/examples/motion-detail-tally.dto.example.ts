import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of MotionDetailTally, for generated tests. */
export const motionDetailTallyExample: ContractExample = contractExample({
  name: "MotionDetailTally",
  fields: [
    {
      name: "absent",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "abstain",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "no",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "passed",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "total",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "yes",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
  ],
  invariants: [],
});
