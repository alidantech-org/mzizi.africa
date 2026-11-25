import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { messageEntryExample } from "@test/modules/product/schema/dto/examples/message-entry.dto.example.ts";

/** The contract shape of MessageCollection, for generated tests. */
export const messageCollectionExample: ContractExample = contractExample({
  name: "MessageCollection",
  fields: [
    {
      name: "messages",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => messageEntryExample },
    },
  ],
  invariants: [],
});
