import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { currencyEntryExample } from "@test/modules/reference/schema/dto/examples/currency-entry.dto.example.ts";

/** The contract shape of CurrencyCollection, for generated tests. */
export const currencyCollectionExample: ContractExample = contractExample({
  name: "CurrencyCollection",
  fields: [
    {
      name: "currencies",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => currencyEntryExample },
    },
  ],
  invariants: [],
});
