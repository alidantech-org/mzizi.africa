import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of NavigationItem, for generated tests. */
export const navigationItemExample: ContractExample = contractExample({
  name: "NavigationItem",
  fields: [
    {
      name: "available",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "view",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255 },
    },
  ],
  invariants: [],
});
