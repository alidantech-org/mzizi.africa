import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of MotionDetailParties, for generated tests. */
export const motionDetailPartiesExample: ContractExample = contractExample({
  name: "MotionDetailParties",
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
      name: "party",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
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
