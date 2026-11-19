import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of MotionDetailLegalProvision, for generated tests. */
export const motionDetailLegalProvisionExample: ContractExample = contractExample({
  name: "MotionDetailLegalProvision",
  fields: [
    {
      name: "designation",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "instrument",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "title",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
