import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of FeatureEntryNames, for generated tests. */
export const featureEntryNamesExample: ContractExample = contractExample({
  name: "FeatureEntryNames",
  fields: [
    {
      name: "languageId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
  ],
  invariants: [],
});
