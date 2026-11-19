import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of LeaderProfileElection, for generated tests. */
export const leaderProfileElectionExample: ContractExample = contractExample({
  name: "LeaderProfileElection",
  fields: [
    {
      name: "candidates",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "heldOn",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "margin",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "registered",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "runnerUp",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "share",
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
      name: "votes",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "year",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
  ],
  invariants: [],
});
