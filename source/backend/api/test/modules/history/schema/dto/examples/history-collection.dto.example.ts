import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { historyEntryExample } from "@test/modules/history/schema/dto/examples/history-entry.dto.example.ts";

/** The contract shape of HistoryCollection, for generated tests. */
export const historyCollectionExample: ContractExample = contractExample({
  name: "HistoryCollection",
  fields: [
    {
      name: "occurrences",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => historyEntryExample },
    },
  ],
  invariants: [],
});
