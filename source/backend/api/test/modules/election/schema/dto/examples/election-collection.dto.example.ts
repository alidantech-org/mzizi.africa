import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { electionEntryExample } from "@test/modules/election/schema/dto/examples/election-entry.dto.example.ts";

/** The contract shape of ElectionCollection, for generated tests. */
export const electionCollectionExample: ContractExample = contractExample({
  name: "ElectionCollection",
  fields: [
    {
      name: "elections",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => electionEntryExample },
    },
  ],
  invariants: [],
});
