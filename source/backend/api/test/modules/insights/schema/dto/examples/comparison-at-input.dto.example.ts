import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of ComparisonAtInput, for generated tests. */
export const comparisonAtInputExample: ContractExample = contractExample({
  name: "ComparisonAtInput",
  fields: [
    {
      name: "a",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 1500 },
    },
    {
      name: "b",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 1500 },
    },
    {
      name: "countryCode",
      optional: false,
      nullable: false,
      spec: { kind: "string", exactLength: 2, patterns: ["^[A-Z]{2}$"] },
    },
    {
      name: "languageCode",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 2, maxLength: 35 },
    },
    {
      name: "metrics",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 1000 },
    },
  ],
  invariants: [],
});
