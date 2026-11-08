import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";

/** The contract shape of GeographySearchQuery, for generated tests. */
export const geographySearchQueryExample: ContractExample = contractExample({
  name: "GeographySearchQuery",
  fields: [
    {
      name: "country",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 2, maxLength: 40 },
    },
    {
      name: "limit",
      optional: true,
      nullable: false,
      spec: { kind: "number", integer: true, min: 1, max: 50 },
    },
    {
      name: "q",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 120 },
    },
  ],
  invariants: [
  ],
});