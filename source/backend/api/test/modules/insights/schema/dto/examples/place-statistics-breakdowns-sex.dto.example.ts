import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of PlaceStatisticsBreakdownsSex, for generated tests. */
export const placeStatisticsBreakdownsSexExample: ContractExample = contractExample({
  name: "PlaceStatisticsBreakdownsSex",
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
