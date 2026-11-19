import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { placeStatisticsSiblingsDensityExample } from "@test/modules/insights/schema/dto/examples/place-statistics-siblings-density.dto.example.ts";
import { placeStatisticsSiblingsPopulationExample } from "@test/modules/insights/schema/dto/examples/place-statistics-siblings-population.dto.example.ts";

/** The contract shape of PlaceStatisticsSiblings, for generated tests. */
export const placeStatisticsSiblingsExample: ContractExample = contractExample({
  name: "PlaceStatisticsSiblings",
  fields: [
    {
      name: "density",
      optional: true,
      nullable: true,
      spec: {
        kind: "schema",
        example: () => placeStatisticsSiblingsDensityExample,
      },
    },
    {
      name: "peers",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "population",
      optional: true,
      nullable: true,
      spec: {
        kind: "schema",
        example: () => placeStatisticsSiblingsPopulationExample,
      },
    },
  ],
  invariants: [],
});
