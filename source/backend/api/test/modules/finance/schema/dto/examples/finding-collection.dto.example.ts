import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { findingEntryExample } from "@test/modules/finance/schema/dto/examples/finding-entry.dto.example.ts";

/** The contract shape of FindingCollection, for generated tests. */
export const findingCollectionExample: ContractExample = contractExample({
  name: "FindingCollection",
  fields: [
    {
      name: "findings",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => findingEntryExample },
    },
  ],
  invariants: [],
});
