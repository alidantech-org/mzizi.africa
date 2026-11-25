import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { commitmentEntryExample } from "@test/modules/politics/schema/dto/examples/commitment-entry.dto.example.ts";

/** The contract shape of CommitmentCollection, for generated tests. */
export const commitmentCollectionExample: ContractExample = contractExample({
  name: "CommitmentCollection",
  fields: [
    {
      name: "commitments",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => commitmentEntryExample },
    },
  ],
  invariants: [],
});
