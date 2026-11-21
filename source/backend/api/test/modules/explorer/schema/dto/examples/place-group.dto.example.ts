import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { placeExample } from "@test/modules/explorer/schema/dto/examples/place.dto.example.ts";

/** The contract shape of PlaceGroup, for generated tests. */
export const placeGroupExample: ContractExample = contractExample({
  name: "PlaceGroup",
  fields: [
    {
      name: "children",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => placeExample },
    },
    {
      name: "place",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => placeExample },
    },
    {
      name: "total",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
    },
  ],
  invariants: [],
});
