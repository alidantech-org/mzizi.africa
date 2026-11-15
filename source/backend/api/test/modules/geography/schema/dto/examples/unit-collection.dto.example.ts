import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { unitEntryExample } from "@test/modules/geography/schema/dto/examples/unit-entry.dto.example.ts";

/** The contract shape of UnitCollection, for generated tests. */
export const unitCollectionExample: ContractExample = contractExample({
  name: "UnitCollection",
  fields: [
    {
      name: "units",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => unitEntryExample },
    },
  ],
  invariants: [],
});
