import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of FeatureDetailNames, for generated tests. */
export const featureDetailNamesExample: ContractExample = contractExample({
  name: "FeatureDetailNames",
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
