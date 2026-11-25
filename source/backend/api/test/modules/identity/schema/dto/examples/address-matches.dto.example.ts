import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { addressMatchExample } from "@test/modules/identity/schema/dto/examples/address-match.dto.example.ts";

/** The contract shape of AddressMatches, for generated tests. */
export const addressMatchesExample: ContractExample = contractExample({
  name: "AddressMatches",
  fields: [
    {
      name: "addresses",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => addressMatchExample },
    },
  ],
  invariants: [],
});
