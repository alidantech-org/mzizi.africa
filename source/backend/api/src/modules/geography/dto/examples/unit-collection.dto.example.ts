import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { unitEntryExample } from "#/modules/geography/dto/examples/unit-entry.dto.example.ts";

/** The contract shape of UnitCollection, for generated tests. */
export const unitCollectionExample: ContractExample = contractExample({
  name: "UnitCollection",
  fields: [
    {
      name: "units",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => unitEntryExample },
    },
  ],
  invariants: [
  ],
});