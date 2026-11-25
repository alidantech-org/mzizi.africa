import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { billEntryExample } from "@test/modules/legislature/schema/dto/examples/bill-entry.dto.example.ts";

/** The contract shape of BillCollection, for generated tests. */
export const billCollectionExample: ContractExample = contractExample({
  name: "BillCollection",
  fields: [
    {
      name: "bills",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => billEntryExample },
    },
  ],
  invariants: [],
});
