import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of ElectionDetailContests, for generated tests. */
export const electionDetailContestsExample: ContractExample = contractExample({
  name: "ElectionDetailContests",
  fields: [
    {
      name: "contests",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "kind",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
