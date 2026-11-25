import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { tenderEntryExample } from "@test/modules/civic/schema/dto/examples/tender-entry.dto.example.ts";

/** The contract shape of TenderCollection, for generated tests. */
export const tenderCollectionExample: ContractExample = contractExample({
  name: "TenderCollection",
  fields: [
    {
      name: "tenders",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => tenderEntryExample },
    },
  ],
  invariants: [],
});
