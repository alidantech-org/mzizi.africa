import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { placeEntryExample } from "@test/modules/geography/schema/dto/examples/place-entry.dto.example.ts";

/** The contract shape of PlaceCollection, for generated tests. */
export const placeCollectionExample: ContractExample = contractExample({
  name: "PlaceCollection",
  fields: [
    {
      name: "places",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => placeEntryExample },
    },
  ],
  invariants: [],
});
