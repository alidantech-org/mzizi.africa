import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { useEntryExample } from "@test/modules/media/schema/dto/examples/use-entry.dto.example.ts";

/** The contract shape of UseCollection, for generated tests. */
export const useCollectionExample: ContractExample = contractExample({
  name: "UseCollection",
  fields: [
    {
      name: "uses",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => useEntryExample },
    },
  ],
  invariants: [],
});
