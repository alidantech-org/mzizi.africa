import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of PointQuery, for generated tests. */
export const pointQueryExample: ContractExample = contractExample({
  name: "PointQuery",
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
  ],
  invariants: [],
});
