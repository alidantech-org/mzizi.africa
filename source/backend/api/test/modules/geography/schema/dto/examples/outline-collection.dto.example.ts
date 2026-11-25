import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { outlineEntryExample } from "@test/modules/geography/schema/dto/examples/outline-entry.dto.example.ts";

/** The contract shape of OutlineCollection, for generated tests. */
export const outlineCollectionExample: ContractExample = contractExample({
  name: "OutlineCollection",
  fields: [
    {
      name: "outlines",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => outlineEntryExample },
    },
  ],
  invariants: [],
});
