import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";

/** The contract shape of GeographyFeatureResponse, for generated tests. */
export const geographyFeatureResponseExample: ContractExample = contractExample({
  name: "GeographyFeatureResponse",
  fields: [
    {
      name: "boundaryVerified",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "geojson",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 2 },
    },
  ],
  invariants: [
  ],
});