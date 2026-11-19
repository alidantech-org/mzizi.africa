import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { placeStatisticsComparisonsPlaceExample } from "@test/modules/insights/schema/dto/examples/place-statistics-comparisons-place.dto.example.ts";

/** The contract shape of PlaceStatisticsComparisons, for generated tests. */
export const placeStatisticsComparisonsExample: ContractExample = contractExample({
  name: "PlaceStatisticsComparisons",
  fields: [
    {
      name: "areaKm2",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "density",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "place",
      optional: false,
      nullable: false,
      spec: {
        kind: "schema",
        example: () => placeStatisticsComparisonsPlaceExample,
      },
    },
    {
      name: "population",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
  ],
  invariants: [],
});
