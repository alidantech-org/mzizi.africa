import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of ElectionList, for generated tests. */
export const electionListExample: ContractExample = contractExample({
  name: "ElectionList",
  fields: [
    {
      name: "elections",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
  ],
  invariants: [],
});
