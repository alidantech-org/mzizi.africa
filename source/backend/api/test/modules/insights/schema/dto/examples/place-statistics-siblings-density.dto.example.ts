import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of PlaceStatisticsSiblingsDensity, for generated tests. */
export const placeStatisticsSiblingsDensityExample: ContractExample = contractExample({
  name: "PlaceStatisticsSiblingsDensity",
  fields: [
    {
      name: "of",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "position",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
  ],
  invariants: [],
});
