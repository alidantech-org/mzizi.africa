import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of PlaceStatisticsSiblingsPopulation, for generated tests. */
export const placeStatisticsSiblingsPopulationExample: ContractExample = contractExample({
  name: "PlaceStatisticsSiblingsPopulation",
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
