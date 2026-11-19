import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of GovernanceTreeRailRefs, for generated tests. */
export const governanceTreeRailRefsExample: ContractExample = contractExample({
  name: "GovernanceTreeRailRefs",
  fields: [
    {
      name: "code",
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
      name: "table",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
