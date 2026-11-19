import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of PartyDetailResults, for generated tests. */
export const partyDetailResultsExample: ContractExample = contractExample({
  name: "PartyDetailResults",
  fields: [
    {
      name: "candidates",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "contest",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "votes",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "won",
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
