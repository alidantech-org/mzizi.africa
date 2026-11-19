import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of PlaceStatisticsBreakdownsAge, for generated tests. */
export const placeStatisticsBreakdownsAgeExample: ContractExample = contractExample({
  name: "PlaceStatisticsBreakdownsAge",
  fields: [
    {
      name: "label",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "share",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
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
