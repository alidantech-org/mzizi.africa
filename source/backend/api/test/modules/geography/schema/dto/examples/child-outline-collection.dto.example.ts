import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { childOutlineEntryExample } from "@test/modules/geography/schema/dto/examples/child-outline-entry.dto.example.ts";

/** The contract shape of ChildOutlineCollection, for generated tests. */
export const childOutlineCollectionExample: ContractExample = contractExample({
  name: "ChildOutlineCollection",
  fields: [
    {
      name: "children",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => childOutlineEntryExample },
    },
  ],
  invariants: [],
});
