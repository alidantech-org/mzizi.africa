import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of PlaceCivicFund, for generated tests. */
export const placeCivicFundExample: ContractExample = contractExample({
  name: "PlaceCivicFund",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "funds",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "managedBy",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
