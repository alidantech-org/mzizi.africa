import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of ElectionDetailElection, for generated tests. */
export const electionDetailElectionExample: ContractExample = contractExample({
  name: "ElectionDetailElection",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "contestKind",
      optional: true,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "electionId",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "heldOn",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
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
