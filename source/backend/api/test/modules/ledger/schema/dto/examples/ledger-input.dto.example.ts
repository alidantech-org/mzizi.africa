import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of LedgerInput, for generated tests. */
export const ledgerInputExample: ContractExample = contractExample({
  name: "LedgerInput",
  fields: [
    {
      name: "limit",
      optional: true,
      nullable: false,
      spec: { kind: "number", integer: true, min: 1, max: 500 },
    },
  ],
  invariants: [],
});
