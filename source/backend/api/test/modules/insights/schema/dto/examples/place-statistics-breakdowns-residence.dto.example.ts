import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of PlaceStatisticsBreakdownsResidence, for generated tests. */
export const placeStatisticsBreakdownsResidenceExample: ContractExample = contractExample({
  name: "PlaceStatisticsBreakdownsResidence",
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
