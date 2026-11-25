import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { postEntryExample } from "@test/modules/community/schema/dto/examples/post-entry.dto.example.ts";

/** The contract shape of PostCollection, for generated tests. */
export const postCollectionExample: ContractExample = contractExample({
  name: "PostCollection",
  fields: [
    {
      name: "posts",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => postEntryExample },
    },
  ],
  invariants: [],
});
