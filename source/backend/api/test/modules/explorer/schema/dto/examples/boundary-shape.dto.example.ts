import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of BoundaryShape, for generated tests. */
export const boundaryShapeExample: ContractExample = contractExample({
  name: "BoundaryShape",
  fields: [
    {
      name: "address",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 1500 },
    },
    {
      name: "bbox",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "number", min: -180, max: 180 },
    },
    {
      name: "childCount",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "geometry",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "json" },
    },
    {
      name: "kind",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "kindCode",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255 },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "population",
      optional: true,
      nullable: true,
      spec: { kind: "number", min: 0, max: 100000000000 },
    },
  ],
  invariants: [],
});
