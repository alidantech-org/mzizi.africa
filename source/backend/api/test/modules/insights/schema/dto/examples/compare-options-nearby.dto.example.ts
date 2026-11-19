import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of CompareOptionsNearby, for generated tests. */
export const compareOptionsNearbyExample: ContractExample = contractExample({
  name: "CompareOptionsNearby",
  fields: [
    {
      name: "distanceKm",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "featureId",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "kindLabel",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "path",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
