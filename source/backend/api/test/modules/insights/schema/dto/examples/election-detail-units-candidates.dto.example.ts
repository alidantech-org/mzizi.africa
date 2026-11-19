import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of ElectionDetailUnitsCandidates, for generated tests. */
export const electionDetailUnitsCandidatesExample: ContractExample = contractExample({
  name: "ElectionDetailUnitsCandidates",
  fields: [
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "party",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "partyCode",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "share",
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
  ],
  invariants: [],
});
