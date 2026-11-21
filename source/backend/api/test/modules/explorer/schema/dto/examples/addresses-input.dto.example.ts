import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of AddressesInput, for generated tests. */
export const addressesInputExample: ContractExample = contractExample({
  name: "AddressesInput",
  fields: [
    {
      name: "addresses",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 1500 },
    },
    {
      name: "languageCode",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 2, maxLength: 35 },
    },
  ],
  invariants: [],
});
