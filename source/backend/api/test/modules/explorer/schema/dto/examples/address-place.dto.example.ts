import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { placeExample } from "@test/modules/explorer/schema/dto/examples/place.dto.example.ts";

/** The contract shape of AddressPlace, for generated tests. */
export const addressPlaceExample: ContractExample = contractExample({
  name: "AddressPlace",
  fields: [
    {
      name: "address",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 1500 },
    },
    {
      name: "place",
      optional: true,
      nullable: true,
      spec: { kind: "schema", example: () => placeExample },
    },
  ],
  invariants: [],
});
