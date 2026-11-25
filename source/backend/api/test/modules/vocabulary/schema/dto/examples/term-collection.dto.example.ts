import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { termEntryExample } from "@test/modules/vocabulary/schema/dto/examples/term-entry.dto.example.ts";

/** The contract shape of TermCollection, for generated tests. */
export const termCollectionExample: ContractExample = contractExample({
  name: "TermCollection",
  fields: [
    {
      name: "terms",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => termEntryExample },
    },
  ],
  invariants: [],
});
