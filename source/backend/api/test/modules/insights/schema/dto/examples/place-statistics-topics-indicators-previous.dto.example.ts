import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of PlaceStatisticsTopicsIndicatorsPrevious, for generated tests. */
export const placeStatisticsTopicsIndicatorsPreviousExample: ContractExample = contractExample({
  name: "PlaceStatisticsTopicsIndicatorsPrevious",
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
