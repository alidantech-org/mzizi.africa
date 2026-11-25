import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { voteEntryExample } from "@test/modules/legislature/schema/dto/examples/vote-entry.dto.example.ts";

/** The contract shape of VoteCollection, for generated tests. */
export const voteCollectionExample: ContractExample = contractExample({
  name: "VoteCollection",
  fields: [
    {
      name: "votes",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => voteEntryExample },
    },
  ],
  invariants: [],
});
