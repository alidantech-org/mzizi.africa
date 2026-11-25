import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { occurrenceEntryExample } from "@test/modules/event/schema/dto/examples/occurrence-entry.dto.example.ts";

/** The contract shape of OccurrenceCollection, for generated tests. */
export const occurrenceCollectionExample: ContractExample = contractExample({
  name: "OccurrenceCollection",
  fields: [
    {
      name: "occurrences",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => occurrenceEntryExample },
    },
  ],
  invariants: [],
});
