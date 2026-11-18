import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of NearbyInput, for generated tests. */
export const nearbyInputExample: ContractExample = contractExample({
  name: "NearbyInput",
  fields: [
    {
      name: "latitude",
      optional: false,
      nullable: false,
      spec: { kind: "number", min: -90, max: 90 },
    },
    {
      name: "longitude",
      optional: false,
      nullable: false,
      spec: { kind: "number", min: -180, max: 180 },
    },
    {
      name: "radiusKm",
      optional: true,
      nullable: false,
      spec: { kind: "number" },
    },
  ],
  invariants: [],
});
