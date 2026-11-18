import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of MotionList, for generated tests. */
export const motionListExample: ContractExample = contractExample({
  name: "MotionList",
  fields: [
    {
      name: "motions",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
  ],
  invariants: [],
});
