import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of NavigationInput, for generated tests. */
export const navigationInputExample: ContractExample = contractExample({
  name: "NavigationInput",
  fields: [
    {
      name: "countryCode",
      optional: false,
      nullable: false,
      spec: { kind: "string", exactLength: 2, patterns: ["^[A-Z]{2}$"] },
    },
  ],
  invariants: [],
});
