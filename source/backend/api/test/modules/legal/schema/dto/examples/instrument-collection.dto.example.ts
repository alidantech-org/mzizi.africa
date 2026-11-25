import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { instrumentEntryExample } from "@test/modules/legal/schema/dto/examples/instrument-entry.dto.example.ts";

/** The contract shape of InstrumentCollection, for generated tests. */
export const instrumentCollectionExample: ContractExample = contractExample({
  name: "InstrumentCollection",
  fields: [
    {
      name: "instruments",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => instrumentEntryExample },
    },
  ],
  invariants: [],
});
