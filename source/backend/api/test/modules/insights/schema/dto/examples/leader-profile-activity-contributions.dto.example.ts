import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of LeaderProfileActivityContributions, for generated tests. */
export const leaderProfileActivityContributionsExample: ContractExample = contractExample({
  name: "LeaderProfileActivityContributions",
  fields: [
    {
      name: "count",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "words",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
  ],
  invariants: [],
});
