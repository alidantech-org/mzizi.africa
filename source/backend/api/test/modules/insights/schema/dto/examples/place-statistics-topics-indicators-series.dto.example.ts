import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of PlaceStatisticsTopicsIndicatorsSeries, for generated tests. */
export const placeStatisticsTopicsIndicatorsSeriesExample: ContractExample = contractExample({
  name: "PlaceStatisticsTopicsIndicatorsSeries",
  fields: [
    {
      name: "estimated",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "period",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "value",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
  ],
  invariants: [],
});
