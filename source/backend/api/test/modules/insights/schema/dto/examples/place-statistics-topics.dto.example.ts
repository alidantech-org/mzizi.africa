import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { placeStatisticsTopicsIndicatorsExample } from "@test/modules/insights/schema/dto/examples/place-statistics-topics-indicators.dto.example.ts";

/** The contract shape of PlaceStatisticsTopics, for generated tests. */
export const placeStatisticsTopicsExample: ContractExample = contractExample({
  name: "PlaceStatisticsTopics",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "indicators",
      optional: false,
      nullable: false,
      array: {},
      spec: {
        kind: "schema",
        example: () => placeStatisticsTopicsIndicatorsExample,
      },
    },
    {
      name: "label",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
