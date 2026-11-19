import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { placeStatisticsTopicsIndicatorsLatestExample } from "@test/modules/insights/schema/dto/examples/place-statistics-topics-indicators-latest.dto.example.ts";
import { placeStatisticsTopicsIndicatorsPreviousExample } from "@test/modules/insights/schema/dto/examples/place-statistics-topics-indicators-previous.dto.example.ts";
import { placeStatisticsTopicsIndicatorsSeriesExample } from "@test/modules/insights/schema/dto/examples/place-statistics-topics-indicators-series.dto.example.ts";

/** The contract shape of PlaceStatisticsTopicsIndicators, for generated tests. */
export const placeStatisticsTopicsIndicatorsExample: ContractExample = contractExample({
  name: "PlaceStatisticsTopicsIndicators",
  fields: [
    {
      name: "change",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "higherIsBetter",
      optional: true,
      nullable: true,
      spec: { kind: "boolean" },
    },
    {
      name: "latest",
      optional: false,
      nullable: false,
      spec: {
        kind: "schema",
        example: () => placeStatisticsTopicsIndicatorsLatestExample,
      },
    },
    {
      name: "measure",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "previous",
      optional: true,
      nullable: true,
      spec: {
        kind: "schema",
        example: () => placeStatisticsTopicsIndicatorsPreviousExample,
      },
    },
    {
      name: "series",
      optional: false,
      nullable: false,
      array: {},
      spec: {
        kind: "schema",
        example: () => placeStatisticsTopicsIndicatorsSeriesExample,
      },
    },
    {
      name: "unit",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
