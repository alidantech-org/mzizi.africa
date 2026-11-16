import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { featureEntryExample } from "@test/modules/geography/schema/dto/examples/feature-entry.dto.example.ts";

/** The contract shape of FeatureCollection, for generated tests. */
export const featureCollectionExample: ContractExample = contractExample({
  name: "FeatureCollection",
  fields: [
    {
      name: "features",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => featureEntryExample },
    },
  ],
  invariants: [],
});
