import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { addressPlaceExample } from "@test/modules/explorer/schema/dto/examples/address-place.dto.example.ts";

/** The contract shape of Addresses, for generated tests. */
export const addressesExample: ContractExample = contractExample({
  name: "Addresses",
  fields: [
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "places",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => addressPlaceExample },
    },
  ],
  invariants: [],
});
