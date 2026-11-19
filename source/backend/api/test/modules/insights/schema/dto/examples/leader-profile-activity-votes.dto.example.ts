import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of LeaderProfileActivityVotes, for generated tests. */
export const leaderProfileActivityVotesExample: ContractExample = contractExample({
  name: "LeaderProfileActivityVotes",
  fields: [
    {
      name: "absent",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "abstain",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "attendance",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "no",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "total",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "yes",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
  ],
  invariants: [],
});
