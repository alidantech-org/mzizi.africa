import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of ElectionDetailTotals, for generated tests. */
export const electionDetailTotalsExample: ContractExample = contractExample({
  name: "ElectionDetailTotals",
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
