import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of Recorded, for generated tests. */
export const recordedExample: ContractExample = contractExample({
  name: "Recorded",
  fields: [
    {
      name: "recorded",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
  ],
  invariants: [],
});
