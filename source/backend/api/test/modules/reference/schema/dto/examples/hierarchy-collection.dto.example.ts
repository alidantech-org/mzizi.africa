import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { hierarchyEntryExample } from "@test/modules/reference/schema/dto/examples/hierarchy-entry.dto.example.ts";

/** The contract shape of HierarchyCollection, for generated tests. */
export const hierarchyCollectionExample: ContractExample = contractExample({
  name: "HierarchyCollection",
  fields: [
    {
      name: "hierarchies",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => hierarchyEntryExample },
    },
  ],
  invariants: [],
});
