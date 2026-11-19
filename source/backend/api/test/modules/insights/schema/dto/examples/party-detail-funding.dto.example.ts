import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of PartyDetailFunding, for generated tests. */
export const partyDetailFundingExample: ContractExample = contractExample({
  name: "PartyDetailFunding",
  fields: [
    {
      name: "amountKes",
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
