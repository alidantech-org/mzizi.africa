import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { eraEntryExample } from "@test/modules/history/schema/dto/examples/era-entry.dto.example.ts";

/** The contract shape of EraCollection, for generated tests. */
export const eraCollectionExample: ContractExample = contractExample({
  name: "EraCollection",
  fields: [
    {
      name: "eras",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => eraEntryExample },
    },
  ],
  invariants: [],
});
