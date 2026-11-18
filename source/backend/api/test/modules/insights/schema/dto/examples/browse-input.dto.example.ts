import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of BrowseInput, for generated tests. */
export const browseInputExample: ContractExample = contractExample({
  name: "BrowseInput",
  fields: [
    {
      name: "featureId",
      optional: true,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [],
});
