import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of ElectionDetailUnitsWinner, for generated tests. */
export const electionDetailUnitsWinnerExample: ContractExample = contractExample({
  name: "ElectionDetailUnitsWinner",
  fields: [
    {
      name: "margin",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
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
