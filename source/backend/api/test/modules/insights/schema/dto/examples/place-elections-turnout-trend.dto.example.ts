import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of PlaceElectionsTurnoutTrend, for generated tests. */
export const placeElectionsTurnoutTrendExample: ContractExample = contractExample({
  name: "PlaceElectionsTurnoutTrend",
  fields: [
    {
      name: "registered",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "turnout",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "year",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
  ],
  invariants: [],
});
