import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { appropriationEntryExample } from "@test/modules/finance/schema/dto/examples/appropriation-entry.dto.example.ts";

/** The contract shape of AppropriationCollection, for generated tests. */
export const appropriationCollectionExample: ContractExample = contractExample({
  name: "AppropriationCollection",
  fields: [
    {
      name: "appropriations",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => appropriationEntryExample },
    },
  ],
  invariants: [],
});
