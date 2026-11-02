import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { geographyEntityExample } from "#/modules/geography/dto/geography-entity.dto.example.ts";

/** The contract shape of GeographySearchResponse, for generated tests. */
export const geographySearchResponseExample: ContractExample = contractExample({
  name: "GeographySearchResponse",
  fields: [
    {
      name: "results",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => geographyEntityExample },
    },
  ],
  invariants: [
  ],
});