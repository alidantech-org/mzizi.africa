import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { countryEntryExample } from "@test/modules/reference/schema/dto/examples/country-entry.dto.example.ts";

/** The contract shape of CountryCollection, for generated tests. */
export const countryCollectionExample: ContractExample = contractExample({
  name: "CountryCollection",
  fields: [
    {
      name: "countries",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => countryEntryExample },
    },
  ],
  invariants: [],
});
