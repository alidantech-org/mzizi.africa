import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { boundaryShapeExample } from "@test/modules/explorer/schema/dto/examples/boundary-shape.dto.example.ts";
import { placeExample } from "@test/modules/explorer/schema/dto/examples/place.dto.example.ts";

/** The contract shape of Boundaries, for generated tests. */
export const boundariesExample: ContractExample = contractExample({
  name: "Boundaries",
  fields: [
    {
      name: "bbox",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "number", min: -180, max: 180 },
    },
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "place",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => placeExample },
    },
    {
      name: "shapes",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => boundaryShapeExample },
    },
    {
      name: "withoutBoundary",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
    },
  ],
  invariants: [],
});
