import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { tallyEntryExample } from "@test/modules/election/schema/dto/examples/tally-entry.dto.example.ts";

/** The contract shape of TallyCollection, for generated tests. */
export const tallyCollectionExample: ContractExample = contractExample({
  name: "TallyCollection",
  fields: [
    {
      name: "tallies",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => tallyEntryExample },
    },
  ],
  invariants: [],
});
