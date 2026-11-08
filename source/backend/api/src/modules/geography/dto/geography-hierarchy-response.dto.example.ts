import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { geographyEntityExample } from "#/modules/geography/dto/geography-entity.dto.example.ts";

/** The contract shape of GeographyHierarchyResponse, for generated tests. */
export const geographyHierarchyResponseExample: ContractExample = contractExample({
  name: "GeographyHierarchyResponse",
  fields: [
    {
      name: "ancestors",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => geographyEntityExample },
    },
    {
      name: "children",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => geographyEntityExample },
    },
    {
      name: "entity",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => geographyEntityExample },
    },
  ],
  invariants: [
  ],
});