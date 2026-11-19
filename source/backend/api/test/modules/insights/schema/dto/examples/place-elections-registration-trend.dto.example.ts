import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of PlaceElectionsRegistrationTrend, for generated tests. */
export const placeElectionsRegistrationTrendExample: ContractExample = contractExample({
  name: "PlaceElectionsRegistrationTrend",
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
