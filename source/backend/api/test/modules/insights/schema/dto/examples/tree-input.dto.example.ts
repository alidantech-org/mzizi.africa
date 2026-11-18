import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of TreeInput, for generated tests. */
export const treeInputExample: ContractExample = contractExample({
  name: "TreeInput",
  fields: [
    {
      name: "featureId",
      optional: true,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [],
});
