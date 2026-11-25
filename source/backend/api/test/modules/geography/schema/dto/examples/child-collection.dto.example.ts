import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { childEntryExample } from "@test/modules/geography/schema/dto/examples/child-entry.dto.example.ts";

/** The contract shape of ChildCollection, for generated tests. */
export const childCollectionExample: ContractExample = contractExample({
  name: "ChildCollection",
  fields: [
    {
      name: "children",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => childEntryExample },
    },
  ],
  invariants: [],
});
