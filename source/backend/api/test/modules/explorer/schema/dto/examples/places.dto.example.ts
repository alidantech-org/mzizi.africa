import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { placeExample } from "@test/modules/explorer/schema/dto/examples/place.dto.example.ts";

/** The contract shape of Places, for generated tests. */
export const placesExample: ContractExample = contractExample({
  name: "Places",
  fields: [
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "limit",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 1, max: 100 },
    },
    {
      name: "page",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 1 },
    },
    {
      name: "places",
      optional: false,
      nullable: false,
      array: {},
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
