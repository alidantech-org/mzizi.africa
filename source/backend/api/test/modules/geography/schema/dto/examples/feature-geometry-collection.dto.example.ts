import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { featureGeometryExample } from "@test/modules/geography/schema/dto/examples/feature-geometry.dto.example.ts";

/** The contract shape of FeatureGeometryCollection, for generated tests. */
export const featureGeometryCollectionExample: ContractExample = contractExample({
  name: "FeatureGeometryCollection",
  fields: [
    {
      name: "geometries",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => featureGeometryExample },
    },
  ],
  invariants: [],
});
