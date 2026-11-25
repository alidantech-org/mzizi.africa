import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { projectEntryExample } from "@test/modules/civic/schema/dto/examples/project-entry.dto.example.ts";

/** The contract shape of ProjectCollection, for generated tests. */
export const projectCollectionExample: ContractExample = contractExample({
  name: "ProjectCollection",
  fields: [
    {
      name: "projects",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => projectEntryExample },
    },
  ],
  invariants: [],
});
