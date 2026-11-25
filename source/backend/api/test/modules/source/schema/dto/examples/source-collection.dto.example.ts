import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { sourceEntryExample } from "@test/modules/source/schema/dto/examples/source-entry.dto.example.ts";

/** The contract shape of SourceCollection, for generated tests. */
export const sourceCollectionExample: ContractExample = contractExample({
  name: "SourceCollection",
  fields: [
    {
      name: "sources",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => sourceEntryExample },
    },
  ],
  invariants: [],
});
