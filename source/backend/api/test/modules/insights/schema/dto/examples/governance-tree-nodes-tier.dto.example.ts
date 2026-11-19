import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of GovernanceTreeNodesTier, for generated tests. */
export const governanceTreeNodesTierExample: ContractExample = contractExample({
  name: "GovernanceTreeNodesTier",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "label",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "position",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
  ],
  invariants: [],
});
