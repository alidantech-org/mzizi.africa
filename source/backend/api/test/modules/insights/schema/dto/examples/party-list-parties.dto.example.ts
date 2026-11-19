import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of PartyListParties, for generated tests. */
export const partyListPartiesExample: ContractExample = contractExample({
  name: "PartyListParties",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "fundAllocationKes",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "members",
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
      name: "officeHolders",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "votes2022",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
  ],
  invariants: [],
});
