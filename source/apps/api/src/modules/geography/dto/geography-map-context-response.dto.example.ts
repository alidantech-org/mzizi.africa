import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";

/** The contract shape of GeographyMapContextResponse, for generated tests. */
export const geographyMapContextResponseExample: ContractExample = contractExample({
  name: "GeographyMapContextResponse",
  fields: [
    {
      name: "parentGeojson",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 2 },
    },
    {
      name: "siblingsGeojson",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 2 },
    },
  ],
  invariants: [
  ],
});