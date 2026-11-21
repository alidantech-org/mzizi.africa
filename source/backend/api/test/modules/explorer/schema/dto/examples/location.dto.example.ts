import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { contextExample } from "@test/modules/explorer/schema/dto/examples/context.dto.example.ts";
import { placeGroupExample } from "@test/modules/explorer/schema/dto/examples/place-group.dto.example.ts";
import { placesExample } from "@test/modules/explorer/schema/dto/examples/places.dto.example.ts";

/** The contract shape of Location, for generated tests. */
export const locationExample: ContractExample = contractExample({
  name: "Location",
  fields: [
    {
      name: "context",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => contextExample },
    },
    {
      name: "found",
      optional: true,
      nullable: true,
      spec: { kind: "schema", example: () => placesExample },
    },
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "groups",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => placeGroupExample },
    },
  ],
  invariants: [],
});
