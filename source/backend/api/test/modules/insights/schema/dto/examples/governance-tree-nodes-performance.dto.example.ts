import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of GovernanceTreeNodesPerformance, for generated tests. */
export const governanceTreeNodesPerformanceExample: ContractExample = contractExample({
  name: "GovernanceTreeNodesPerformance",
  fields: [
    {
      name: "basis",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "of",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "rank",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "samples",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "score",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "text",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
