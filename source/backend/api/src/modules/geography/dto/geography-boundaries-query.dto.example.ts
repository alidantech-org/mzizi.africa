import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";

/** The contract shape of GeographyBoundariesQuery, for generated tests. */
export const geographyBoundariesQueryExample: ContractExample = contractExample({
  name: "GeographyBoundariesQuery",
  fields: [
    {
      name: "country",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 2, maxLength: 40 },
    },
    {
      name: "level",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
  ],
  invariants: [
  ],
});